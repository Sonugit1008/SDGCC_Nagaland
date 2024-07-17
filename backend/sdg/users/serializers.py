from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import ugettext_lazy as _
from django.forms.models import model_to_dict
from django.contrib.auth.models import Group
from organization.models import Department
from organization.serializers import DepartmentSerializer
from sdg.users.models import UserProfile
from django.db import transaction

class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user authentication object"""

    def update(self, instance, validated_data):
        return Token.objects.filter(**validated_data)

    def create(self, validated_data):
        return Token.objects.create(**validated_data)

    email = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        """Validate and authenticate the user"""
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )
        if not user:
            msg = _('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs


class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user authentication object"""

    def update(self, instance, validated_data):
        return Token.objects.filter(**validated_data)

    def create(self, validated_data):
        return Token.objects.create(**validated_data)

    email = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        """Validate and authenticate the user"""
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password
        )
        if not user:
            msg = _('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        username = user.username

        token['username'] = user.username
        if UserProfile.objects.filter(user=user).exists():
            my_profile = UserProfileSerializer(UserProfile.objects.get(user=user))
            my_profile.data.pop("profile_picture")

            token["profile"] = my_profile.data
        else:
            user_profile = UserProfile.objects.create(user=user)
            my_profile = {"profile_picture": "default", "first_name": "", "last_name": "", "gender": "", "address": ""}
            token["profile"] = my_profile

        if user.is_superuser:
            token["superadmin"] = True
        
        departments = Department.objects.filter(users__email=user.username)
        token['department'] = []
        
        if departments.exists():
            dept_list = []
            for dept in departments:
                dept_list.append(str(dept.name))
            token['department'] = dept_list
        
        token['user_id'] = user.id
        user_group_list = user.groups.values_list('name', flat=True)  # QuerySet Object
        l_as_list = list(user_group_list)  # QuerySet to `list`
        if user.is_superuser:
            l_as_list.append("superadmin")
        token["groups"] = l_as_list

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        username = self.user.username

        if UserProfile.objects.filter(user__username=username).exists():
            my_profile = model_to_dict(UserProfile.objects.get(user__username=username))
            image = my_profile.pop("profile_picture")

            if image and hasattr(image, 'url'):
                request = self.context.get('request')
                my_profile["profile_picture"] = request.build_absolute_uri(image.url)
            else:
                my_profile["profile_picture"] = ""
            data["profile"] = my_profile
        else:
            my_profile = {"profile_picture": "default", "first_name": "", "last_name": "", "gender": "", "address": ""}
            data["profile"] = my_profile

        if self.user.is_superuser:
            data["superadmin"] = True

        data['username'] = self.user.username
        data['user_id'] = self.user.id

        return data


class UserProfileSerializer(serializers.ModelSerializer):
    """User profile serializer """
    user = serializers.SlugRelatedField(

        queryset=get_user_model().objects.all(),
        slug_field='id'
    )

    class Meta:
        model = UserProfile
        fields = '__all__'


class UserAdminNewSerializer(serializers.ModelSerializer):
    """serializer for Admin to manage users """

    @transaction.atomic
    def create(self, validated_data):

        if 'groups' in validated_data:
            groups = validated_data.pop('groups')

        if 'department_set' in validated_data:
            departments = validated_data.pop('department_set')
        
        user = get_user_model().objects.create_user(username=validated_data["email"], **validated_data)
        user.set_password(validated_data["password"])

        for department in departments:
            department.users.add(user)
        # Pop out profile and save it """
        # pop out permissions and save it

        # Put user in group
        for group in groups:
            user_group = Group.objects.get(name=group)
            user.groups.add(user_group)

        return user

    @transaction.atomic
    def update(self, instance, validated_data):

        if 'groups' in validated_data:
            instance.groups.clear()
            groups = validated_data.pop('groups')
            for group in groups:
                user_group = Group.objects.get(name=group)
                instance.groups.add(user_group)
        
        if 'department_set' in validated_data:
            instance.department_set.clear()
            departments = validated_data.pop('department_set')
            for department in departments:
                department.users.add(instance)

        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        
        return super().update(instance, validated_data)

    groups = serializers.SlugRelatedField(

        many=True,
        queryset=Group.objects.all(),
        slug_field='name',

    )

    department = serializers.SlugRelatedField(
        source='department_set', many=True,  slug_field='name', queryset=Department.objects.all(),
    )

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'mobile', 'groups', 'department')
        extra_kwargs = {'password': {'write_only': True, 'required': False, 'min_length': 5}}


class GroupsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ('name',)


class ChangePasswordSerializer(serializers.Serializer):
    model = get_user_model()
    """
    Serializer for password change endpoint.
    """
    oldpassword = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for creating general user."""

    def create(self, validated_data):

        user = get_user_model().objects.create_user(username=validated_data['email'], **validated_data)
        user_profile = UserProfile.objects.create(user=user)
        
        user.set_password(validated_data["password"])

        # Put user in group
        user_group = Group.objects.get(name="general_user")
        user.groups.add(user_group)

        return user

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'mobile')
        extra_kwargs = {'password': {'write_only': True, 'required': True, 'min_length': 5}}


class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()
    new_password = serializers.CharField()