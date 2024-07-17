from rest_framework.permissions import BasePermission, SAFE_METHODS


class SystemAdministratorPermission(BasePermission):
    
    def has_permission(self, request, view):
        """Check if the user has permission"""

        if request.user.groups.filter(name='system_administrator').exists():
            return True


class DataEntryOperatorPermission(BasePermission):
    
    def has_permission(self, request, view):
        """Check if the user has permission"""

        if request.user.groups.filter(name='data_entry_operator').exists():
            return True