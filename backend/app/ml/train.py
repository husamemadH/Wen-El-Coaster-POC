"""Offline training script.

Reads GPS traces from ``app/data/traces/``, cuts them into route segments,
joins them with the features, trains a gradient-boosted regressor targeting
``traversal_time_seconds``, and writes ``model.pkl``.
"""
