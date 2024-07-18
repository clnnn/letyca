#!/bin/bash

# Start Ollama in the background.
/bin/ollama serve &
# Record Process ID.
pid=$!

# Pause for Ollama to start.
sleep 5

echo "🔴 Create chart-metadata model"
ollama create chart-metadata -f /tmp/chart-metadata/Modelfile
echo "🟢 chart-metadata model created!"

# Wait for Ollama process to finish.
wait $pid