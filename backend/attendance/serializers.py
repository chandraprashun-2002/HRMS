from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from .models import Attendance
from employees.models import Employee
from datetime import date as date_today


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
        # Remove default unique_together validator - we handle it manually
        validators = []

    def validate(self, data):
        """Validate attendance data"""
        employee = data.get('employee')
        date = data.get('date')
        
        # Prevent future attendance
        if date > date_today.today():
            raise serializers.ValidationError({
                "date": "Cannot mark attendance for a future date."
            })
        
        # Check for duplicate attendance on the same date
        if self.instance is None:  # Create
            if Attendance.objects.filter(employee=employee, date=date).exists():
                raise serializers.ValidationError({
                    "date": "Attendance already marked for this employee on this date."
                })
        else:  # Update
            # Check if trying to change to a date that already has attendance (excluding current record)
            if Attendance.objects.filter(employee=employee, date=date).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError({
                    "date": "Cannot update: Attendance already exists for this employee on the selected date."
                })
        
        # Validate status
        status = data.get('status')
        if status not in ['Present', 'Absent']:
            raise serializers.ValidationError({
                "status": "Status must be 'Present' or 'Absent'."
            })
        
        return data
