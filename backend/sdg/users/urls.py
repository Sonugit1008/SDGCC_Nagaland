from django.urls import path, include
from rest_framework import routers

from sdg.users import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from sdg.users.views import (
    user_detail_view,
    user_redirect_view,
    user_update_view,
    MyTokenObtainPairView,
)

user_profile_router = routers.SimpleRouter()
user_profile_router.register('user/profile', views.UserProfileViewSet)

admin_manage_users = routers.SimpleRouter()
admin_manage_users.register('admin/users', views.UserAdminNewView, basename='admin_user_view')

admin_group = routers.SimpleRouter()
admin_group.register('admin/groups', views.GroupView, basename='admin_group_view')

change_password = routers.SimpleRouter()
change_password.register('userauth/password/change', views.ChangePasswordView, basename='change_password_view')

register_user = routers.SimpleRouter()
register_user.register('userauth/registration', views.UserRegistration, basename='register_user_view')

request_password_reset_router = routers.SimpleRouter()
request_password_reset_router.register('password/request_reset', views.RequestPasswordResetViewSet,
                                       basename='password_request_reset')

reset_password_router = routers.SimpleRouter()
reset_password_router.register('password/reset', views.ResetPasswordViewSet, basename='reset_password')


app_name = "users"
urlpatterns = [
    path("", include(user_profile_router.urls)),
    path("", include(admin_manage_users.urls)),
    path("", include(admin_group.urls)),
    path("", include(change_password.urls)),
    path("", include(register_user.urls)),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-token-auth/', views.CreateTokenView.as_view(), name="api-auth-token"),
    path("~redirect/", view=user_redirect_view, name="redirect"),
    path("~update/", view=user_update_view, name="update"),
    path("<str:username>/", view=user_detail_view, name="detail"),
    path('', include(request_password_reset_router.urls)),
    path('', include(reset_password_router.urls)),
]
