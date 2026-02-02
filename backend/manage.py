import os
import sys


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            f"Couldn't import Django, getting  error: {exc}. "
            "Are you sure it's installed and available on your PYTHONPATH? "
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
