from rest_framework import routers
from organization import views
from django.urls import path, include



view_department_router = routers.SimpleRouter()
view_department_router.register('department/view', views.DepartmentAllViewSet)

department_create_router = routers.SimpleRouter()
department_create_router.register('department/create', views.DepartmentCreateViewSet)

department_router = routers.SimpleRouter()
department_router.register('department', views.DepartmentViewSet)

state_read_router = routers.SimpleRouter()
state_read_router.register('state/view', views.StateReadViewSet)

state_router = routers.SimpleRouter()
state_router.register('state', views.StateViewSet)

district_read_router = routers.SimpleRouter()
district_read_router.register('district/view', views.DistrictReadViewSet)

district_router = routers.SimpleRouter()
district_router.register('district', views.DistrictViewSet)

location_read_router = routers.SimpleRouter()
location_read_router.register('location/view', views.LocationReadViewSet)

location_router = routers.SimpleRouter()
location_router.register('location', views.LocationViewSet)

public_goal_read_router = routers.SimpleRouter()
public_goal_read_router.register('public/goal', views.PublicGoalViewSet)

goal_update_router = routers.SimpleRouter()
goal_update_router.register('goal/update', views.GoalUpdateViewSet)

goal_create_router = routers.SimpleRouter()
goal_create_router.register('goal/create', views.GoalCreateViewSet)

goal_delete_router = routers.SimpleRouter()
goal_delete_router.register('goal/delete', views.GoalDeleteViewSet)

goal_router = routers.SimpleRouter()
goal_router.register('goal', views.GoalViewSet)

periodicity_read_router = routers.SimpleRouter()
periodicity_read_router.register('periodicity/view', views.PeriodicityReadViewSet)

periodicity_router = routers.SimpleRouter()
periodicity_router.register('periodicity', views.PeriodicityViewSet)

unit_read_router = routers.SimpleRouter()
unit_read_router.register('unit/view', views.UnitReadViewSet)

unit_router = routers.SimpleRouter()
unit_router.register('unit', views.UnitViewSet)

view_indicator_router = routers.SimpleRouter()
view_indicator_router.register('indicator/view', views.IndicatorAllViewSet)

indicator_read_router = routers.SimpleRouter()
indicator_read_router.register('indicator/list', views.IndicatorReadViewSet)

indicator_router = routers.SimpleRouter()
indicator_router.register('indicator', views.IndicatorViewSet)

scheme_read_router = routers.SimpleRouter()
scheme_read_router.register('scheme/view', views.SchemeReadViewSet)

scheme_router = routers.SimpleRouter()
scheme_router.register('scheme', views.SchemeViewSet)

indicatorvalue_read_router = routers.SimpleRouter()
indicatorvalue_read_router.register('indicatorvalue/view', views.IndicatorValueReadViewSet)

indicatorvalue_router = routers.SimpleRouter()
indicatorvalue_router.register('indicatorvalue', views.IndicatorValueViewSet)

targets_router = routers.SimpleRouter()
targets_router.register('targets', views.TargetsViewSet)

dataentry_router = routers.SimpleRouter()
dataentry_router.register('dataentry', views.DataEntryViewSet)

scorevalue_router = routers.SimpleRouter()
scorevalue_router.register('score/create', views.ScoreCreateViewSet)

score_view_router = routers.SimpleRouter()
score_view_router.register('score/view', views.ScoreReadViewSet)

public_score_view_router = routers.SimpleRouter()
public_score_view_router.register('public/score', views.ScorePublicReadViewSet)

score_router = routers.SimpleRouter()
score_router.register('score', views.ScoreViewSet)

goalvalue_router = routers.SimpleRouter()
goalvalue_router.register('goalvalue', views.GoalValueViewSet)

public_indicator_read_router = routers.SimpleRouter()
public_indicator_read_router.register('public/indicator', views.PublicIndicatorViewSet)

public_reports_read_router = routers.SimpleRouter()
public_reports_read_router.register('public/report', views.PublicReportViewSet)

reports_router = routers.SimpleRouter()
reports_router.register('report', views.ReportViewSet)

newscore_view_router = routers.SimpleRouter()
newscore_view_router.register('newscore/view', views.NewScoreReadViewSet)

newscore_router = routers.SimpleRouter()
newscore_router.register('newscore', views.NewScoreViewSet)

data_reports_router = routers.SimpleRouter()
data_reports_router.register('datareport', views.DataReportViewSet)

rank_view_router = routers.SimpleRouter()
rank_view_router.register('rank/view', views.RankReadViewSet)

public_rank_view_router = routers.SimpleRouter()
public_rank_view_router.register('public/rank', views.RankPublicReadViewSet)

rank_router = routers.SimpleRouter()
rank_router.register('rank', views.RankViewSet)

app_name = 'organization'

urlpatterns = [
    path('', include(view_department_router.urls)),
    path('', include(department_create_router.urls)),
    path('', include(department_router.urls)),
    path('', include(state_read_router.urls)),
    path('', include(state_router.urls)),
    path('', include(district_read_router.urls)),
    path('', include(district_router.urls)),
    path('', include(location_read_router.urls)),
    path('', include(location_router.urls)),
    path('', include(public_goal_read_router.urls)),
    path('', include(goal_update_router.urls)),
    path('', include(goal_create_router.urls)),
    path('', include(goal_delete_router.urls)),
    path('', include(goal_router.urls)),
    path('', include(periodicity_read_router.urls)),
    path('', include(periodicity_router.urls)),
    path('', include(unit_read_router.urls)),
    path('', include(unit_router.urls)),
    path('', include(view_indicator_router.urls)),
    path('', include(indicator_read_router.urls)),
    path('', include(indicator_router.urls)),
    path('', include(scheme_router.urls)),
    path('', include(indicatorvalue_router.urls)),
    path('', include(targets_router.urls)),
    path('', include(dataentry_router.urls)),
    path('', include(scorevalue_router.urls)),
    path('', include(goalvalue_router.urls)),
    path('', include(score_view_router.urls)),
    path('', include(public_score_view_router.urls)),
    path('', include(score_router.urls)),
    path('', include(public_indicator_read_router.urls)),
    path('', include(public_reports_read_router.urls)),
    path('', include(reports_router.urls)),
    path('', include(newscore_view_router.urls)),
    path('', include(newscore_router.urls)),
    path('', include(data_reports_router.urls)),
    path('', include(rank_view_router.urls)),
    path('', include(public_rank_view_router.urls)),
    path('', include(rank_router.urls)),
    ]

