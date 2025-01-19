from django.http import JsonResponse
from .models import Number
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from .models import Number

@ensure_csrf_cookie
@require_http_methods(["POST"])
def increment_number(request):
    try:
        number, created = Number.objects.get_or_create(id=1, defaults={'value': 0})

        number.value += 1
        number.save()

        return JsonResponse({'success': True, 'current_number': number.value})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@ensure_csrf_cookie
@require_http_methods(["GET"])
def get_number(request):
    try:
        number = Number.objects.get(id=1)  
        return JsonResponse({'current_number': number.value})
    except Number.DoesNotExist:
        return JsonResponse({'error': 'Counter not found'}, status=404)

@require_http_methods(["POST"])
def reset_number(request):
    try:
        number, created = Number.objects.get_or_create(id=1, defaults={'value': 0})
        
        number.value = 0
        number.save()

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)
