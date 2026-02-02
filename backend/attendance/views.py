from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        queryset = Attendance.objects.all()
        employee_id = self.request.query_params.get('employee_id', None)
        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Attendance marked successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"message": "Validation failed", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        employee_id = request.query_params.get('employee_id', None)
        if employee_id:
            message = f"Attendance records for employee {employee_id}"
        else:
            message = "All attendance records retrieved"
        
        return Response({
            "message": message,
            "count": queryset.count(),
            "data": serializer.data
        })
