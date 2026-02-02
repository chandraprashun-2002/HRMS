from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'employee', 'employee_name', 'date', 'status')
    search_fields = ('employee_name', 'employee__employee_id')
    list_filter = ('status', 'date')
