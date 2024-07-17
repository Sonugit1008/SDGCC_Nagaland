from rest_framework import filters
from sdg.users.models import UserProfile


class UserFilters(filters.BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        if queryset.model is UserProfile:
            queryset = queryset.filter(user__email=request.user.email)

            return queryset
