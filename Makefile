.PHONY:
pre-commit-install:
	pre-commit install --hook-type pre-push --config ./scripts/push.sh
