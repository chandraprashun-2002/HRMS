from django.db import models
from employees.models import Employee


class Attendance(models.Model):
    employee = models.ForeignKey(
        Employee, 
        on_delete=models.CASCADE, 
        to_field='employee_id',
        related_name='attendance_records'
    )
    employee_name = models.CharField(max_length=200)
    date = models.DateField()
    status = models.CharField(max_length=20)  # Present, Absent

    class Meta:
        db_table = 'attendance'
        unique_together = ['employee', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.employee_name} - {self.date} - {self.status}"
