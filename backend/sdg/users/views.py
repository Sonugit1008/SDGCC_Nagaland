from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.generic import DetailView, RedirectView, UpdateView
from rest_framework import generics, mixins, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny, IsAdminUser
from sdg.users.filters import UserFilters
from sdg.users.models import UserProfile
from sdg.users.serializers import (
    AuthTokenSerializer, ChangePasswordSerializer, GroupsSerializer,
    MyTokenObtainPairSerializer, UserAdminNewSerializer, UserProfileSerializer,
    UserRegistrationSerializer, RequestPasswordResetSerializer, ResetPasswordSerializer
)
from rest_framework.settings import api_settings
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import Group
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from django.utils import timezone as tz

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from django.utils import timezone

User = get_user_model()


class UserDetailView(LoginRequiredMixin, DetailView):

    model = User
    slug_field = "username"
    slug_url_kwarg = "username"


user_detail_view = UserDetailView.as_view()


class UserUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):

    model = User
    fields = ["name"]
    success_message = _("Information successfully updated")

    def get_success_url(self):
        assert (
            self.request.user.is_authenticated
        )  # for mypy to know that the user is authenticated
        return self.request.user.get_absolute_url()

    def get_object(self):
        return self.request.user


user_update_view = UserUpdateView.as_view()


class UserRedirectView(LoginRequiredMixin, RedirectView):

    permanent = False

    def get_redirect_url(self):
        return reverse("users:detail", kwargs={"username": self.request.user.username})


user_redirect_view = UserRedirectView.as_view()


class CreateTokenView(generics.CreateAPIView):
    """Create a new user system"""
    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
    permission_classes = (AllowAny,)


class CustomUserRateThrottle(AnonRateThrottle):
    rate = '20/hour'


class MyTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [CustomUserRateThrottle]
    serializer_class = MyTokenObtainPairSerializer


class UserProfileViewSet(viewsets.GenericViewSet, mixins.ListModelMixin,
                         mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    """Manage User Profile Alert API"""

    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated,)
    queryset = UserProfile.objects.all()
    filter_backends = [UserFilters, ]
    serializer_class = UserProfileSerializer


class GroupView(viewsets.GenericViewSet, mixins.ListModelMixin):
    """Manage Group API"""

    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, IsAdminUser)
    queryset = Group.objects.all()
    serializer_class = GroupsSerializer


class UserAdminNewView(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin,
                       mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    """Manage create new user by admin"""
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = (IsAuthenticated, IsAdminUser)
    queryset = get_user_model().objects.all()
    serializer_class = UserAdminNewSerializer


class ChangePasswordView(viewsets.GenericViewSet, UpdateAPIView, mixins.UpdateModelMixin):
    """
        An endpoint for changing password.
        """
    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def create(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("oldpassword")):
                return Response({"oldpassword": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            if not serializer.data.get("new_password1") == serializer.data.get("new_password2"):
                return Response({"new_password1": ["New passwords dont match"]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password1"))
            self.object.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserRegistration(viewsets.GenericViewSet, mixins.CreateModelMixin):
    """Manage User Registration API"""

    authentication_classes = (TokenAuthentication, SessionAuthentication, JWTAuthentication)
    permission_classes = ()
    queryset = get_user_model().objects.all()
    serializer_class = UserRegistrationSerializer


def generate_otp():
    import random
    import math

    digits = [i for i in range(0, 10)]
    random_str = ''

    for i in range(6):
        index = math.floor(random.random() * 10)
        random_str += str(digits[index])

    return random_str


def send_email_otp(otp, subject='OTP from SDGCC', from_email='noreply@falconavl.com', to_emails=[]):
    msg=MIMEMultipart('alternative')
    msg['From']=from_email
    msg['To']=", ".join(to_emails)
    msg['Subject']=subject
    txt_part=MIMEText("User, {0} is the OTP to reset password".format(otp),'plain')
    msg.attach(txt_part)

    html_part = MIMEText(f"<p>User, Here is your OTP to reset password</p><h1>{otp}</h1>", 'html')
    msg.attach(html_part)
    msg_str=msg.as_string()


    server=smtplib.SMTP(host='smtp-relay.sendinblue.com',port=587)
    server.ehlo()
    server.starttls()
    server.login('appstore@falconavl.com','W8s3EHKvL4Ahq0bU')
    response = server.sendmail(from_email,to_emails,msg_str)
    server.quit()
    return response


class RequestPasswordResetViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    permission_classes = ()
    serializer_class = RequestPasswordResetSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')

            if not get_user_model().objects.filter(email=email).exists():
                return Response({'info': 'user not registered'}, status=status.HTTP_400_BAD_REQUEST)

            demo_otp = generate_otp()
            # demo_otp = '987654'

            user = get_user_model().objects.get(email=email)
            user_profile = None
            
            if UserProfile.objects.filter(user=user).exists():
                user_profile = UserProfile.objects.get(user=user)
            else:
                user_profile = UserProfile.objects.create(user=user)

            if user_profile:
                # Check if the user has made a password reset request within the last hour
                last_reset_request_time = user_profile.email_otp_timestamp
                current_time = timezone.now()

                # Calculate the time difference in minutes
                time_difference_minutes = (current_time - last_reset_request_time).total_seconds() / 60 # Convert to hours

                # Check if the user's last password reset request was within the rate limit
                if time_difference_minutes < 1:
                    return Response({'error': 'You have exceeded the rate limit for OTP requests. Please wait for some time before requesting another OTP.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                otp_status = send_email_otp(otp=demo_otp, to_emails=[email])
            except:
                pass
                
            user_profile.email_otp = demo_otp
            user_profile.email_otp_timestamp = tz.now()
            user_profile.otp_count = 0
            user_profile.save()
            return Response({'info': 'OTP sent to email'}, status=status.HTTP_200_OK)


class ResetPasswordViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    permission_classes = ()
    serializer_class = ResetPasswordSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            otp = serializer.data.get('otp')
            new_password = serializer.data.get('new_password')

            if not get_user_model().objects.filter(email=email).exists():
                return Response({'error': 'User not registered'}, status=status.HTTP_400_BAD_REQUEST)

            user = get_user_model().objects.get(email=email)
            user_profile = UserProfile.objects.get(user=user)
            user_profile.otp_count = user_profile.otp_count + 1
            user_profile.save()
            
            if user_profile.otp_count > 4:
                return Response({'error': 'You have exceeded the rate limit for OTP verification. Please try after sometime.'}, status=status.HTTP_400_BAD_REQUEST)

            # otp validation
            if otp == user_profile.email_otp and (tz.now() - user_profile.email_otp_timestamp).total_seconds() <= 300:
                # set password
                user.set_password(new_password)
                user.save()
                # remove otp from db
                user_profile.email_otp = None
                # user_profile.email_otp_timestamp = None
                user_profile.save()
                return Response({'info': 'success'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'OTP validation failed'}, status=status.HTTP_400_BAD_REQUEST)
