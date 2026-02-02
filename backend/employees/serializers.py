from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

    def validate_employee_id(self, value):
        """Check that employee_id is unique on create"""
        if self.instance is None:  # Only check on create
            if Employee.objects.filter(employee_id=value).exists():
                raise serializers.ValidationError("Employee with this ID already exists.")
        return value

    def validate_email(self, value):
        """Check for duplicate email"""
        if self.instance is None:  # Create
            if Employee.objects.filter(email=value).exists():
                raise serializers.ValidationError("Employee with this email already exists.")
        return value

    def validate(self, data):
        """Ensure required fields are not empty"""
        required_fields = ['employee_id', 'full_name', 'email', 'department']
        for field in required_fields:
            if field in data and not data[field]:
                raise serializers.ValidationError({field: f"{field} is required."})
        return data
