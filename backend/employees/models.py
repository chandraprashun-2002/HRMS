from django.db import models


class Employee(models.Model):
    employee_id = models.CharField(max_length=50, primary_key=True, unique=True)
    full_name = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    department = models.CharField(max_length=100)

    class Meta:
        db_table = 'employees'

    def __str__(self):
        return f"{self.employee_id} - {self.full_name}"
