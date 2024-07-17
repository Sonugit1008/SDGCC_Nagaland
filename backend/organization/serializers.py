from typing_extensions import Required
from h11 import Response
from rest_framework import serializers
from organization.models import Department, District, Goal, Indicator, IndicatorValue, Location, NewScores, Periodicity, Ranks, Reports, Scheme, Score, State, Unit
from django.utils import timezone


class IndicatorSerializer(serializers.ModelSerializer):
    """Serializer for Indicators"""

    class Meta:
        model = Indicator
        fields = '__all__'


class IndicatorAllSerializer(serializers.ModelSerializer):
    """Serializer for Indicators"""
    goal = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    unit = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    periodicity = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    department = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    scheme = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")

    class Meta:
        model = Indicator
        fields = ('id', 'name', 'goal', 'unit', 'periodicity', 'department', 'scheme', 'type', 'year', 'denominator_label', 'numerator_label', 'comment', 'is_deleted', 'deleted_by', 'deleted_at')


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Departments"""

    class Meta:
        model = Department
        fields = '__all__'


class DepartmentAllSerializer(serializers.ModelSerializer):
    """Serializer for Departments"""
    state = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    users = serializers.SlugRelatedField(many=True, read_only=True, slug_field="email")
    indicator = IndicatorAllSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = ('id', 'name', 'state', 'users', 'indicator', 'is_deleted')


class StateSerializer(serializers.ModelSerializer):
    """Serializer for States"""

    class Meta:
        model = State
        fields = '__all__'


class DistrictSerializer(serializers.ModelSerializer):
    """Serializer for Districts"""

    class Meta:
        model = District
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    """Serializer for Locations"""

    class Meta:
        model = Location
        fields = '__all__'


class GoalCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Goals"""

    class Meta:
        model = Goal
        fields = '__all__'


class GoalSerializer(serializers.ModelSerializer):
    """Serializer for Goals"""
    state = serializers.SlugRelatedField(
        many=False, 
        read_only=True,
        slug_field="name"
    )

    class Meta:
        model = Goal
        fields = ('id', 'state', 'name', 'image', 'sno', 'is_deleted', 'deleted_by', 'deleted_at')


class PublicGoalSerializer(serializers.ModelSerializer):
    """Serializer for Goals"""
    state = serializers.SlugRelatedField(
        many=False, 
        read_only=True,
        slug_field="name"
    )

    class Meta:
        model = Goal
        fields = ('state', 'name', 'image', 'sno')


class PeriodicitySerializer(serializers.ModelSerializer):
    """Serializer for Periodicitys"""

    class Meta:
        model = Periodicity
        fields = '__all__'


class UnitSerializer(serializers.ModelSerializer):
    """Serializer for Units"""

    class Meta:
        model = Unit
        fields = '__all__'


class SchemeSerializer(serializers.ModelSerializer):
    """Serializer for Schemes"""

    class Meta:
        model = Scheme
        fields = '__all__'


class IndicatorValueSerializer(serializers.ModelSerializer):
    """Serializer for IndicatorValues"""

    class Meta:
        model = IndicatorValue
        fields = '__all__'


class TargetsSerializer(serializers.ModelSerializer):
    """Serializer for Targets"""
    goal = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    unit = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    periodicity = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    department = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    indicatorvalue = IndicatorValueSerializer(many=True, read_only=True)
    scheme = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")

    class Meta:
        model = Indicator
        fields = ('id', 'name', 'department', 'goal', 'periodicity', 'unit', 'indicatorvalue', 'type', 'year', 'scheme', 'is_deleted')


class DataEntrySerializer(serializers.Serializer):
    """Serializer for IndicatorValues"""
    
    baseline = serializers.CharField()
    progress = serializers.CharField()
    target = serializers.CharField()
    id = serializers.CharField()
    start_year = serializers.CharField()
    end_year = serializers.CharField()
    district = serializers.CharField()


class GoalIndicatorValueSerializer(serializers.ModelSerializer):
    """Serializer for IndicatorValues"""
    district = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    
    class Meta:
        model = IndicatorValue
        fields = '__all__'


class ScoreReadSerializer(serializers.ModelSerializer):
    """Serializer State and National Score"""
    goal = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    indicator = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    department = serializers.SerializerMethodField()
    scheme = serializers.SerializerMethodField()
    
    def get_department(self, obj):
        
        if obj.indicator is None or obj.indicator.department is None:
            return None
        
        return obj.indicator.department.name

    def get_scheme(self, obj):
        
        if obj.indicator is None or obj.indicator.scheme is None:
            return None
        
        return obj.indicator.scheme.name
    
    class Meta:
        model = Score
        fields = ('id', 'goal', 'indicator', 'value', 'type', 'name', 'indicator_value', 'year', 'remarks', 'vetted_by_department', 'vetted_by_officer', 'vetted_by', 'report_date', 'category', 'department', 'scheme')


class ScorePublicReadSerializer(serializers.ModelSerializer):
    """Serializer State and National Score"""
    goal = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    indicator = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    department = serializers.SerializerMethodField()
    scheme = serializers.SerializerMethodField()
    
    def get_department(self, obj):
        
        if obj.indicator is None or obj.indicator.department is None:
            return None
        
        return obj.indicator.department.name

    def get_scheme(self, obj):
        
        if obj.indicator is None or obj.indicator.scheme is None:
            return None
        
        return obj.indicator.scheme.name
    # category = serializers.SerializerMethodField()
    
    # def get_category(self, obj):
        
    #     if obj.indicator is None:
    #         return None
        
    #     return obj.indicator.category
    
    class Meta:
        model = Score
        fields = ('name', 'goal', 'indicator', 'type', 'value', 'year', 'category', 'department', 'scheme')
        

class ScoreSerializer(serializers.ModelSerializer):
    """Serializer State and National Score"""
    
    class Meta:
        model = Score
        fields = '__all__'


class ScoreCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating State and National Score"""

    class Meta:
        model = Score
        fields = '__all__'


class GoalValueSerializer(serializers.ModelSerializer):
    """Serializer for GoalValue"""
    goal = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    indicatorvalue = GoalIndicatorValueSerializer(many=True)
    
    class Meta:
        model = Indicator
        fields = ('id', 'name', 'department', 'goal', 'indicatorvalue', 'type', 'year')


class PublicIndicatorSerializer(serializers.ModelSerializer):
    """Serializer for Public Indicators"""
    goal = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    scheme = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    department = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")

    class Meta:
        model = Indicator
        fields = ('name', 'goal', 'year', 'type', 'comment', 'is_deleted','scheme','department')


class ReportSerializer(serializers.ModelSerializer):
    """Serializer for Reports"""
  
    class Meta:
        model = Reports
        fields = '__all__'


class NewScoreSerializer(serializers.ModelSerializer):
    """Serializer State and District New Scores"""
    # tracks = serializers.StringRelatedField(many=True)
    class Meta:
        model = NewScores
        fields = '__all__'
    
    def update(self, instance, validated_data):
        request_user = self.context['request'].user
       
        if validated_data['status'] == 'approved' or validated_data['status'] == 'rejected':
            validated_data['action_by'] = str(request_user)
            validated_data['action_time'] = timezone.now()
        
        return super().update(instance, validated_data)

    def create(self, validated_data):
        validated_data['created_by'] = self.context.get("request").user
        return NewScores.objects.create(**validated_data)


class NewScoreReadSerializer(serializers.ModelSerializer):
    """Serializer State and District New Score"""
    goal = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    indicator = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    
    class Meta:
        model = NewScores
        fields = '__all__'


class DataReportSerializer(serializers.ModelSerializer):
    """Serializer for Score Reports"""
    goal = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    indicator = IndicatorAllSerializer(many=False, read_only=True)
    
    class Meta:
        model = Score
        fields = '__all__'
    
    
class RankPublicReadSerializer(serializers.ModelSerializer):
    """Serializer Public Rank"""
    
    district = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    
    class Meta:
        model = Ranks
        fields = ('district', 'year', 'rank')
        

class RankReadSerializer(serializers.ModelSerializer):
    """Serializer Rank"""

    district = serializers.SlugRelatedField(many=False, read_only=True, slug_field="name")
    
    class Meta:
        model = Ranks
        fields = '__all__'
        

class RankSerializer(serializers.ModelSerializer):
    """Serializer Rank"""
    
    class Meta:
        model = Ranks
        fields = '__all__'
