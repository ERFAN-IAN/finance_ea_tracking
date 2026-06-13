from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Sum
from django.utils import timezone


class TimeStampMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampMixin):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories",
    )
    name = models.CharField(max_length=100)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"], name="uniq_category_per_user"
            ),
        ]

    def __str__(self):
        return self.name


class Account(TimeStampMixin):
    class AccountType(models.TextChoices):
        CASH = "cash", "Cash"
        BANK = "bank", "Bank Account"
        CARD = "card", "Card"
        EWALLET = "ewallet", "E-Wallet"
        OTHER = "other", "Other"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="accounts",
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=AccountType.choices)
    balance = models.PositiveBigIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name"], name="uniq_account_name_per_user"
            ),
        ]

    def __str__(self) -> str:
        return f"{self.name}"


class Expense(TimeStampMixin):
    class ExpenseType(models.TextChoices):
        ONE_TIME = "one_time", "One Time"
        INSTALLMENT = "installment", "Installment"
        RECURRING = "recurring", "Recurring"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        CANCELLED = "cancelled", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="expenses",
    )

    category = models.ForeignKey(
        "Category",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="expenses",
    )

    expense_type = models.CharField(
        max_length=20,
        choices=ExpenseType.choices,
        default=ExpenseType.ONE_TIME,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    total_amount = models.PositiveBigIntegerField()
    incurred_on = models.DateField(default=timezone.localdate)
    note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.total_amount} IRR"

    @property
    def paid_amount(self) -> int:
        agg = (
            self.payments.filter(status=Payment.PaymentStatus.COMPLETED)
            .aggregate(total=Sum("amount"))
            .get("total")
        )
        return int(agg or 0)

    @property
    def remaining_amount(self) -> int:
        return self.total_amount - self.paid_amount

    @property
    def is_paid(self) -> bool:
        return self.remaining_amount <= 0


class Payment(TimeStampMixin):
    class PaymentStatus(models.TextChoices):
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payments",
    )
    expense = models.ForeignKey(
        Expense,
        on_delete=models.CASCADE,
        related_name="payments",
    )
    account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="payments",
    )
    amount = models.PositiveBigIntegerField()
    opening = models.BooleanField(default=False)
    paid_on = models.DateField(default=timezone.localdate)
    status = models.CharField(
        max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.COMPLETED
    )
    note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.amount} from {self.account} on {self.paid_on}"

    def clean(self):
        errors = {}
        if self.user_id and self.expense_id and self.expense.user_id != self.user_id:
            errors["expense"] = "Expense user mismatch."

        if self.user_id and self.account_id and self.account.user_id != self.user_id:
            errors["account"] = "Account user mismatch."

        if errors:
            raise ValidationError(errors)


class AccountTransaction(TimeStampMixin):
    class Direction(models.TextChoices):
        INFLOW = "inflow", "Inflow"
        OUTFLOW = "outflow", "Outflow"

    class SourceType(models.TextChoices):
        PAYMENT = "payment", "Payment"
        TRANSFER = "transfer", "Transfer"
        REFUND = "refund", "Refund"
        ADJUSTMENT = "adjustment", "Adjustment"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="account_transactions",
    )
    account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name="transactions",
    )
    payment = models.OneToOneField(
        "Payment",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="account_transaction",
    )
    direction = models.CharField(max_length=10, choices=Direction.choices)
    source_type = models.CharField(max_length=20, choices=SourceType.choices)
    amount = models.PositiveBigIntegerField()
    occurred_on = models.DateField(default=timezone.localdate)
    note = models.TextField(blank=True)
    transfer_group_id = models.UUIDField(null=True, blank=True)
    external_address = models.CharField(max_length=255, null=True, blank=True)

    def clean(self):
        errors = {}

        if self.user_id and self.account_id and self.account.user_id != self.user_id:
            errors["account"] = "Account user mismatch."

        if self.payment_id:
            if self.user_id and self.payment.user_id != self.user_id:
                errors["payment"] = "Payment user mismatch."
            if self.payment.account_id != self.account_id:
                errors["payment"] = "Payment account mismatch."

        if self.source_type == self.SourceType.TRANSFER:
            if not self.transfer_group_id:
                errors["transfer_group_id"] = (
                    "transfer_group_id is required for transfers."
                )
            if self.external_address and self.direction != self.Direction.OUTFLOW:
                errors["external_address"] = (
                    "external_address is only valid for OUTFLOW transfers."
                )

        elif self.source_type == self.SourceType.REFUND:
            if self.direction != self.Direction.INFLOW:
                errors["direction"] = "Refund transactions must be INFLOW."
            if self.transfer_group_id:
                errors["transfer_group_id"] = (
                    "transfer_group_id can only be set for transfers."
                )

        elif self.source_type == self.SourceType.ADJUSTMENT:
            if self.transfer_group_id:
                errors["transfer_group_id"] = (
                    "transfer_group_id can only be set for transfers."
                )
            if self.external_address:
                errors["external_address"] = (
                    "external_address is not allowed for adjustments."
                )

        if self.source_type == self.SourceType.PAYMENT:
            if not self.payment_id:
                errors["payment"] = "payment is required for payment transactions."
            if self.direction != self.Direction.OUTFLOW:
                errors["direction"] = "Payment transactions must be OUTFLOW."
            if self.transfer_group_id:
                errors["transfer_group_id"] = (
                    "transfer_group_id can only be set for transfers."
                )
            if self.external_address:
                errors["external_address"] = (
                    "external_address is not allowed for payment transactions."
                )

        if errors:
            raise ValidationError(errors)


class InstallmentPlan(TimeStampMixin):
    class ScheduleType(models.TextChoices):
        DAILY = "daily", "Daily"
        WEEKLY = "weekly", "Weekly"
        MONTHLY = "monthly", "Monthly"
        YEARLY = "yearly", "Yearly"

    expense = models.OneToOneField(
        Expense,
        on_delete=models.CASCADE,
        related_name="installment_plan",
    )
    total_installments = models.PositiveIntegerField()
    first_due_date = models.DateField()
    every_n = models.PositiveIntegerField(default=1)
    schedule_type = models.CharField(
        max_length=20,
        choices=ScheduleType.choices,
        default=ScheduleType.MONTHLY,
    )
    upfront_amount = models.PositiveBigIntegerField(default=0)
    due_day_of_month = models.PositiveSmallIntegerField(null=True, blank=True)
    pay_by_day_of_month = models.PositiveSmallIntegerField(null=True, blank=True)

    def clean(self):
        errors = {}

        if (
            self.expense_id
            and self.expense.expense_type != Expense.ExpenseType.INSTALLMENT
        ):
            errors["expense"] = (
                "Expense type must be 'installment' to attach InstallmentPlan."
            )

        if self.total_installments < 1:
            errors["total_installments"] = "total_installments must be >= 1."

        if self.every_n < 1:
            errors["every_n"] = "every_n must be >= 1."

        if self.schedule_type == self.ScheduleType.MONTHLY:
            if self.due_day_of_month is None and self.first_due_date:
                self.due_day_of_month = self.first_due_date.day

            if self.due_day_of_month is None:
                errors["due_day_of_month"] = (
                    "due_day_of_month is required for monthly installments."
                )
            elif not (1 <= self.due_day_of_month <= 31):
                errors["due_day_of_month"] = (
                    "due_day_of_month must be between 1 and 31."
                )

        else:
            if self.due_day_of_month is not None:
                errors["due_day_of_month"] = (
                    "due_day_of_month is only valid for monthly schedule_type."
                )

        if errors:
            raise ValidationError(errors)


class InstallmentItem(TimeStampMixin):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        OVERDUE = "overdue", "Overdue"
        CANCELLED = "cancelled", "Cancelled"

    plan = models.ForeignKey(
        InstallmentPlan,
        on_delete=models.CASCADE,
        related_name="items",
    )
    sequence = models.PositiveIntegerField()
    due_date = models.DateField()
    amount = models.PositiveBigIntegerField()
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    payment = models.OneToOneField(
        Payment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="installment_item",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["plan", "sequence"], name="uniq_installment_sequence_per_plan"
            ),
        ]

    def clean(self):
        if self.amount is not None and self.amount <= 0:
            raise ValidationError({"amount": "Installment amount must be > 0."})
        if self.sequence < 1:
            raise ValidationError({"sequence": "sequence must be >= 1."})


class RecurringExpensePlan(TimeStampMixin):
    class Frequency(models.TextChoices):
        DAILY = "daily", "Daily"
        WEEKLY = "weekly", "Weekly"
        MONTHLY = "monthly", "Monthly"
        YEARLY = "yearly", "Yearly"

    expense = models.OneToOneField(
        Expense,
        on_delete=models.CASCADE,
        related_name="recurring_plan",
    )
    frequency = models.CharField(max_length=20, choices=Frequency.choices)
    every_n = models.PositiveIntegerField(default=1)
    due_day_of_month = models.PositiveSmallIntegerField(null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    next_due_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def clean(self):
        errors = {}

        if self.every_n < 1:
            errors["every_n"] = "every_n must be >= 1."

        if self.end_date and self.end_date < self.start_date:
            errors["end_date"] = "end_date cannot be before start_date."

        if (
            self.expense_id
            and self.expense.expense_type != Expense.ExpenseType.RECURRING
        ):
            errors["expense"] = (
                "Expense type must be 'recurring' to attach RecurringExpensePlan."
            )

        if self.frequency == self.Frequency.MONTHLY:
            if self.due_day_of_month is None:
                if self.start_date:
                    self.due_day_of_month = self.start_date.day
                else:
                    errors["due_day_of_month"] = (
                        "due_day_of_month is required for monthly recurring plans."
                    )
            elif not (1 <= self.due_day_of_month <= 31):
                errors["due_day_of_month"] = (
                    "due_day_of_month must be between 1 and 31."
                )
        else:
            if self.due_day_of_month is not None:
                errors["due_day_of_month"] = (
                    "due_day_of_month is only allowed for monthly recurring plans."
                )

        if errors:
            raise ValidationError(errors)


class RecurringExpenseOccurrence(TimeStampMixin):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        SKIPPED = "skipped", "Skipped"
        OVERDUE = "overdue", "Overdue"
        CANCELLED = "cancelled", "Cancelled"

    plan = models.ForeignKey(
        RecurringExpensePlan,
        on_delete=models.CASCADE,
        related_name="occurrences",
    )
    due_date = models.DateField()
    sequence = models.PositiveIntegerField()
    expected_amount = models.PositiveBigIntegerField()
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    payment = models.OneToOneField(
        Payment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="recurring_occurrence",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["plan", "sequence"],
                name="uniq_recurring_occurrence_per_plan_sequence",
            ),
        ]
