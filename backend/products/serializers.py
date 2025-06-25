from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Product, Category, ProductRating
from django.db.models import Avg

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        return token

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductRatingSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    class Meta:
        model = ProductRating
        fields = ['id', 'user', 'product', 'rating', 'created_at']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        # Get the current user from the request
        user = self.context['request'].user
        # Get the product from validated data
        product = validated_data['product']

        # Check if rating already exists
        rating, created = ProductRating.objects.update_or_create(
            user=user,
            product=product,
            defaults={'rating': validated_data['rating']}
        )
        return rating

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    average_rating = serializers.SerializerMethodField()
    ratings = ProductRatingSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['created_by'] = user
        return super().create(validated_data)

    def get_average_rating(self, obj):
        if not hasattr(obj, 'ratings'):
            return None
        return obj.ratings.aggregate(average=Avg('rating'))['average']