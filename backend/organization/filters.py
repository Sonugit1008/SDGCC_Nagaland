
from rest_framework import filters


class GoalPublicFilter(filters.BaseFilterBackend):
    """Goal filter"""

    def filter_queryset(self, request, queryset, view):
        
        queryset = queryset.exclude(is_deleted=True)
        queryset = queryset.order_by("sno")
        
        return queryset


class ScoreFilter(filters.BaseFilterBackend):
    """Score filter"""

    def filter_queryset(self, request, queryset, view):
        
        type = request.query_params.get('type', None)
        state = request.query_params.get('state', None)
        category = request.query_params.get('category', None)

        if type:
            queryset = queryset.filter(type=type)
        
        if state:
            queryset = queryset.filter(name=state)
        
        if category:
            queryset = queryset.filter(category=category)
        
        queryset = queryset.order_by("goal")
        
        return queryset


class IndicatorFilter(filters.BaseFilterBackend):
    """Indicator filter"""

    def filter_queryset(self, request, queryset, view):
        
        type = request.query_params.get('type', None)
        
        queryset = queryset.exclude(is_deleted=True)
        
        if type:
            queryset = queryset.filter(type=type)
        
        return queryset


class ReportsFilter(filters.BaseFilterBackend):
    """Reports filter"""

    def filter_queryset(self, request, queryset, view):
        
        queryset = queryset.order_by("sno")
        
        return queryset


class DistrictFilter(filters.BaseFilterBackend):
    """District filter"""

    def filter_queryset(self, request, queryset, view):
        
        state = request.query_params.get('state', None)
        
        queryset = queryset.exclude(is_deleted=True)
        
        if state:
            queryset = queryset.filter(state=state)
        
        return queryset
    

class StateFilter(filters.BaseFilterBackend):
    """State filter"""

    def filter_queryset(self, request, queryset, view):
        
        queryset = queryset.exclude(is_deleted=True)
    
        return queryset


class DepartmentFilter(filters.BaseFilterBackend):
    """Department filter"""

    def filter_queryset(self, request, queryset, view):
        
        queryset = queryset.exclude(is_deleted=True)
    
        return queryset


class NewScoreFilter(filters.BaseFilterBackend):
    """New Score filter"""

    def filter_queryset(self, request, queryset, view):
        
        type = request.query_params.get('type', None)
        state = request.query_params.get('state', None)
        status = request.query_params.get('status', None)
        
        queryset = queryset.exclude(is_deleted=True)
        # queryset_ = queryset.filter(created_by=request.user.email)
        
        # if len(queryset_) > 0:
        #     queryset=queryset_
        
        if type:
            queryset = queryset.filter(type=type)
        
        if state:
            queryset = queryset.filter(name=state)
        
        if status:
            queryset = queryset.filter(status=status)
        
        return queryset


class PeriodicityFilter(filters.BaseFilterBackend):
    """Periodicity filter"""

    def filter_queryset(self, request, queryset, view):
        queryset = queryset.exclude(is_deleted=True)
        queryset = queryset.order_by("id")
        
        return queryset


class SchemeFilter(filters.BaseFilterBackend):
    """Scheme filter"""

    def filter_queryset(self, request, queryset, view):
        
        queryset = queryset.exclude(is_deleted=True)
        queryset = queryset.order_by("id")
        
        return queryset


class DataReportsFilter(filters.BaseFilterBackend):
    """Score Reports filter"""

    def filter_queryset(self, request, queryset, view):
        
        queryset = queryset.order_by("id")
        type = request.query_params.get('type', None)
        name = request.query_params.get('name', None)
        goal = request.query_params.get('goal', None)
        
        if type:
            queryset = queryset.filter(type=type)
        
        if name:
            queryset = queryset.filter(name=name)
        
        if goal:
            queryset = queryset.filter(goal=goal)
        
        return queryset


class TargetsFilter(filters.BaseFilterBackend):
    """Targets filter"""

    def filter_queryset(self, request, queryset, view):
        
        type = request.query_params.get('type', None)
        year = request.query_params.get('year', None)
        goal = request.query_params.get('goal', None)
        department = request.query_params.get('department', None)
        name = request.query_params.get('name', None)
        
        if type:
            queryset = queryset.filter(type=type)
        
        if year:
            queryset = queryset.filter(year=year)
        
        if goal:
            queryset = queryset.filter(goal=goal)
        
        if department:
            queryset = queryset.filter(department=department)
        
        if name:
            queryset = queryset.filter(name=name)
        
        queryset = queryset.exclude(is_deleted=True)
        
        return queryset


class RankFilter(filters.BaseFilterBackend):
    """Rank filter"""

    def filter_queryset(self, request, queryset, view):
        queryset = queryset.exclude(is_deleted=True)
        queryset = queryset.order_by("id")
        
        return queryset
