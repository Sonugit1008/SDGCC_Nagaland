from django.utils import timezone
from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, mixins, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from organization import serializers
from organization.filters import DataReportsFilter, DepartmentFilter, DistrictFilter, GoalPublicFilter, IndicatorFilter, NewScoreFilter, PeriodicityFilter, RankFilter, ReportsFilter, SchemeFilter, ScoreFilter, StateFilter, TargetsFilter
from organization.models import Department, District, Goal, Indicator, IndicatorValue, Location, NewScores, Periodicity, Ranks, Reports, Scheme, Score, State, Unit
from organization.permissions import SystemAdministratorPermission
from organization.serializers import DataEntrySerializer, DataReportSerializer, DepartmentAllSerializer, DepartmentSerializer, DistrictSerializer, GoalCreateSerializer, GoalSerializer, GoalValueSerializer, IndicatorAllSerializer, IndicatorSerializer, IndicatorValueSerializer, LocationSerializer, NewScoreReadSerializer, NewScoreSerializer, PeriodicitySerializer, PublicGoalSerializer, PublicIndicatorSerializer, RankPublicReadSerializer, RankReadSerializer, RankSerializer, ReportSerializer, SchemeSerializer, ScoreCreateSerializer, ScorePublicReadSerializer, ScoreReadSerializer, ScoreSerializer, StateSerializer, TargetsSerializer, UnitSerializer
from django.db.models import Q

class DepartmentViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Department.objects.all()
    filter_backends = [DepartmentFilter]
    serializer_class = DepartmentSerializer
    
    def destroy(self, request, *args, **kwargs):
        department = Department.objects.get(id=kwargs['pk'])
        department.is_deleted = True
        department.deleted_by = str(request.user)
        department.deleted_at = timezone.now()
        department.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class DepartmentCreateViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, SystemAdministratorPermission)
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DepartmentAllViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Get All Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Department.objects.prefetch_related('state').prefetch_related('indicator').all()
    filter_backends = [DepartmentFilter]
    serializer_class = DepartmentAllSerializer


class StateReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage State Read API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = ()
    queryset = State.objects.all()
    filter_backends = [StateFilter]
    serializer_class = StateSerializer
    

class StateViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin):
    """Manage State API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = State.objects.all()
    filter_backends = [StateFilter]
    serializer_class = StateSerializer
    
    def destroy(self, request, *args, **kwargs):
        state = State.objects.get(id=kwargs['pk'])
        state.is_deleted = True
        state.deleted_by = str(request.user)
        state.deleted_at = timezone.now()
        state.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class DistrictReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage District Read API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = ()
    queryset = District.objects.all()
    filter_backends = [DistrictFilter]
    serializer_class = DistrictSerializer
    

class DistrictViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin):
    """Manage District API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = District.objects.all()
    filter_backends = [DistrictFilter]
    serializer_class = DistrictSerializer
    
    def destroy(self, request, *args, **kwargs):
        district = District.objects.get(id=kwargs['pk'])
        district.is_deleted = True
        district.deleted_by = str(request.user)
        district.deleted_at = timezone.now()
        district.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class LocationReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Locations Read API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    

class LocationViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class GoalCreateViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Goal.objects.all()
    serializer_class = GoalCreateSerializer
    
    
class GoalDeleteViewSet(viewsets.GenericViewSet, mixins.DestroyModelMixin):
    """Manage Goal Delete API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Goal.objects.all()
    serializer_class = GoalCreateSerializer

    def destroy(self, request, *args, **kwargs):
        goal = Goal.objects.get(id=kwargs['pk'])
        goal.is_deleted = True
        goal.deleted_by = str(request.user)
        goal.deleted_at = timezone.now()
        goal.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class GoalUpdateViewSet(viewsets.GenericViewSet, mixins.UpdateModelMixin):
    """Manage Update Goal API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Goal.objects.all()
    serializer_class = GoalCreateSerializer


class GoalViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Goal.objects.all()
    filter_backends = [GoalPublicFilter]
    serializer_class = GoalSerializer


class PublicGoalViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Public Goals API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = ()
    queryset = Goal.objects.all()
    filter_backends = [GoalPublicFilter]
    serializer_class = PublicGoalSerializer


class PeriodicityReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Periodicity API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Periodicity.objects.all()
    filter_backends = [PeriodicityFilter]
    serializer_class = PeriodicitySerializer
    

class PeriodicityViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin, mixins.DestroyModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Periodicity.objects.all()
    filter_backends = [PeriodicityFilter]
    serializer_class = PeriodicitySerializer
    
    def destroy(self, request, *args, **kwargs):
        periodicity = Periodicity.objects.get(id=kwargs['pk'])
        periodicity.is_deleted = True
        periodicity.deleted_by = str(request.user)
        periodicity.deleted_at = timezone.now()
        periodicity.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class UnitReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Unit Read API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer
    

class UnitViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

class IndicatorAllViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Get All Indicators API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Indicator.objects.prefetch_related('goal').prefetch_related('department').prefetch_related('unit').prefetch_related('periodicity').all()
    filter_backends = [IndicatorFilter]
    serializer_class = IndicatorAllSerializer


class IndicatorReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Indicator.objects.all()
    filter_backends = [IndicatorFilter]
    serializer_class = IndicatorSerializer


class IndicatorViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin, mixins.DestroyModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Indicator.objects.all()
    filter_backends = [IndicatorFilter]
    serializer_class = IndicatorSerializer
    
    def destroy(self, request, *args, **kwargs):
        indicator = Indicator.objects.get(id=kwargs['pk'])
        indicator.is_deleted = True
        indicator.deleted_by = str(request.user)
        indicator.deleted_at = timezone.now()
        indicator.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class SchemeReadViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Scheme.objects.all()
    filter_backends = [SchemeFilter]
    serializer_class = SchemeSerializer


class SchemeViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin, mixins.DestroyModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Scheme.objects.all()
    filter_backends = [SchemeFilter]
    serializer_class = SchemeSerializer
    
    def destroy(self, request, *args, **kwargs):
        scheme = Scheme.objects.get(id=kwargs['pk'])
        scheme.is_deleted = True
        scheme.deleted_by = str(request.user)
        scheme.deleted_at = timezone.now()
        scheme.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class IndicatorValueReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Indicator Values API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = IndicatorValue.objects.all()
    serializer_class = IndicatorValueSerializer
    

class IndicatorValueViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin):
    """Manage Indicator Values API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = IndicatorValue.objects.all()
    serializer_class = IndicatorValueSerializer


class TargetsViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Indicator Values API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Indicator.objects.prefetch_related('indicatorvalue').prefetch_related('unit').prefetch_related('department').prefetch_related('periodicity').prefetch_related('goal').all()
    serializer_class = TargetsSerializer
    filter_backends = [TargetsFilter]


class DataEntryViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    """Manage Upload Data Values API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    serializer_class = DataEntrySerializer
    queryset = IndicatorValue.objects.all()

    def create(self, request):
        serializers = self.get_serializer(data=request.data)
        if serializers.is_valid():
            baseline = serializers.data.get('baseline')
            district = serializers.data.get('district')
            progress = serializers.data.get('progress')
            target = serializers.data.get('target')
            start_year = serializers.data.get('start_year')
            end_year = serializers.data.get('end_year')
            id = serializers.data.get('id')

            if baseline:
                if IndicatorValue.objects.filter(indicator=id, 
                                                                start_year=start_year, 
                                                                end_year=end_year, 
                                                                district=district,
                                                                value_type="baseline"
                                                                ).exists():

                    indicatorValue = IndicatorValue.objects.get(indicator=id, 
                                                    start_year=start_year, 
                                                    end_year=end_year, 
                                                    district=district,
                                                    value_type="baseline"
                                                    )
                    indicatorValue.value = baseline
                    indicatorValue.save()
                else:
                    indicator = Indicator.objects.get(id=id)
                    district_ = District.objects.get(id=district)
                    IndicatorValue.objects.create(indicator=indicator, 
                                                                start_year=start_year, 
                                                                end_year=end_year, 
                                                                district=district_,
                                                                value_type="baseline",
                                                                value=baseline
                                                                )
            
            if progress:
                if IndicatorValue.objects.filter(indicator=id, 
                                                                start_year=start_year, 
                                                                end_year=end_year, 
                                                                district=district,
                                                                value_type="progress"
                                                                ).exists():

                    indicatorValue = IndicatorValue.objects.get(indicator=id, 
                                                    start_year=start_year, 
                                                    end_year=end_year, 
                                                    district=district,
                                                    value_type="progress"
                                                    )
                    indicatorValue.value = progress
                    indicatorValue.save()
                else:
                    indicator = Indicator.objects.get(id=id)
                    district_ = District.objects.get(id=district)
                    IndicatorValue.objects.create(indicator=indicator, 
                                                                start_year=start_year, 
                                                                end_year=end_year, 
                                                                district=district_,
                                                                value_type="progress",
                                                                value=progress
                                                                )
            
            if target:
                if IndicatorValue.objects.filter(indicator=id, 
                                                                start_year=start_year, 
                                                                end_year=end_year, 
                                                                district=district,
                                                                value_type="target"
                                                                ).exists():

                    indicatorValue = IndicatorValue.objects.get(indicator=id, 
                                                    start_year=start_year, 
                                                    end_year=end_year, 
                                                    district=district,
                                                    value_type="target"
                                                    )
                    indicatorValue.value = target
                    indicatorValue.save()
                else:
                    indicator = Indicator.objects.get(id=id)
                    district_ = District.objects.get(id=district)
                    IndicatorValue.objects.create(indicator=indicator, 
                                                                start_year=start_year, 
                                                                end_year=end_year, 
                                                                district=district_,
                                                                value_type="target",
                                                                value=baseline
                                                                )

        return Response({},status=status.HTTP_200_OK)


class ScoreCreateViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    """Manage Department API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Score.objects.all()
    serializer_class = ScoreCreateSerializer


class ScoreReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Read Score API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Score.objects.prefetch_related('goal').all()
    serializer_class = ScoreReadSerializer
    filter_backends = [ScoreFilter]
    

class ScoreViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    """Manage Score API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer


class ScorePublicReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Public Read Score API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = ()
    queryset = Score.objects.prefetch_related('goal').all()
    serializer_class = ScorePublicReadSerializer
    filter_backends = [ScoreFilter]


class GoalValueViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Upload Data Values API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = ()
    queryset = Indicator.objects.prefetch_related('indicatorvalue').prefetch_related('goal').all()
    serializer_class = GoalValueSerializer
    filter_backends = [TargetsFilter]


class PublicIndicatorViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Public Indicator API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = ()
    queryset = Indicator.objects.prefetch_related('goal').all()
    filter_backends = [IndicatorFilter]
    serializer_class = PublicIndicatorSerializer


class ReportViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin, mixins.DestroyModelMixin):
    """Manage Report API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Reports.objects.all()
    filter_backends = [ReportsFilter]
    serializer_class = ReportSerializer


class PublicReportViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Report API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = ()
    queryset = Reports.objects.all()
    filter_backends = [ReportsFilter]
    serializer_class = ReportSerializer


class NewScoreViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin):
    """Manage New Scores API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = NewScores.objects.all()
    serializer_class = NewScoreSerializer
    def perform_create(self, serializer):
        new_score = serializer.save()
        Score.objects.create(
            value='122',
            goal=new_score.goal,
            type="Some type",  # Add appropriate logic to set type
            name=new_score.name,
            year=new_score.year,
            category=Score.Aspirant,  # Default or dynamic assignment
        )

    def destroy(self, request, *args, **kwargs):
        score = NewScores.objects.get(id=kwargs['pk'])
        score.is_deleted = True
        score.deleted_by = str(request.user)
        score.deleted_at = timezone.now()
        score.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class NewScoreReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Read New Score API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = NewScores.objects.prefetch_related('goal').all()
    serializer_class = NewScoreReadSerializer
    filter_backends = [NewScoreFilter]


class DataReportViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Report API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Score.objects.all()
    filter_backends = [DataReportsFilter]
    serializer_class = DataReportSerializer


class RankReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Read Rank API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Ranks.objects.all()
    serializer_class = RankReadSerializer
    filter_backends = [RankFilter]
    

class RankViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    """Manage Rank API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, )
    queryset = Ranks.objects.all()
    serializer_class = RankSerializer
    
    def destroy(self, request, *args, **kwargs):
        rank = Ranks.objects.get(id=kwargs['pk'])
        rank.is_deleted = True
        rank.deleted_by = str(request.user)
        rank.deleted_at = timezone.now()
        rank.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class RankPublicReadViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Public Read Rank API"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = ()
    queryset = Ranks.objects.all()
    serializer_class = RankPublicReadSerializer
    filter_backends = [RankFilter]
