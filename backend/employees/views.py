from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field = 'employee_id'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Employee created successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"message": "Validation failed", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            employee_name = instance.full_name
            self.perform_destroy(instance)
            return Response(
                {"message": f"Employee '{employee_name}' deleted successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"message": "Error deleting employee", "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "message": "Employees retrieved successfully",
            "count": queryset.count(),
            "data": serializer.data
        })
