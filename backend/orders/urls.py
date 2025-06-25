from django.urls import path
from .views import (
    CartDetailView, AddToCartView, UpdateCartItemView, RemoveCartItemView,
    OrderListCreateView, OrderDetailView
)

urlpatterns = [
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/items/<int:pk>/', UpdateCartItemView.as_view(), name='update-cart-item'),
    path('cart/items/<int:pk>/remove/', RemoveCartItemView.as_view(), name='remove-cart-item'),
    path('', OrderListCreateView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]