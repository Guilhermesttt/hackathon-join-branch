from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Session, DailyCheckin


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'type', 'is_staff', 'is_active')
    list_filter = ('type', 'is_staff', 'is_active', 'date_joined')
    fieldsets = UserAdmin.fieldsets + (
        ('Informações Adicionais', {'fields': ('type', 'photo', 'birth', 'phone', 'crp')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informações Adicionais', {'fields': ('type', 'photo', 'birth', 'phone', 'crp')}),
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)


class SessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'psychologist', 'date', 'start_time', 'end_time')
    list_filter = ('date', 'psychologist')
    search_fields = ('user__username', 'psychologist__username')
    date_hierarchy = 'date'


class DailyCheckinAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'intensity', 'energy', 'stability', 'created_at')
    list_filter = ('date', 'created_at', 'user')
    search_fields = ('user__username', 'notes')
    date_hierarchy = 'date'
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Usuário', {'fields': ('user',)}),
        ('Métricas', {'fields': ('intensity', 'energy', 'stability')}),
        ('Informações Adicionais', {'fields': ('notes', 'tags', 'date')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Session, SessionAdmin)
admin.site.register(DailyCheckin, DailyCheckinAdmin)
