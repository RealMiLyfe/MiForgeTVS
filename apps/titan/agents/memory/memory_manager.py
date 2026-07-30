import requests
import uuid
from datetime import datetime

class MemoryManager:
    def __init__(self):
        self.chroma_url = "http://localhost:8001"
        self.ollama_url = "http://localhost:11434/api/embeddings"
        self.embed_model = "nomic-embed-text"

    def _get_embedding(self, text: str) -> list:
        try:
            response = requests.post(
                self.ollama_url,
                json={"model": self.embed_model, "prompt": text}
            )
            response.raise_for_status()
            return response.json().get("embedding")
        except Exception as e:
            print(f"[ERROR] Failed to get embedding: {e}")
            return None

    def _ensure_collection(self, name: str):
        try:
            collection_url = f"{self.chroma_url}/api/v2/tenants/default_tenant/databases/default_database/collections/{name}"
            response = requests.get(collection_url)
            if response.status_code == 404:
                create_response = requests.post(
                    collection_url,
                    json={"name": name}
                )
                create_response.raise_for_status()
        except Exception as e:
            print(f"[ERROR] Failed to ensure collection: {e}")

    def store_client_memory(self, client_slug, agent_name, action_type, content, metadata=None):
        try:
            collection_name = f"client_{client_slug}_memory"
            self._ensure_collection(collection_name)
            doc_id = str(uuid.uuid4())
            embedding = self._get_embedding(content)
            if embedding is not None:
                document_url = f"{self.chroma_url}/api/v2/tenants/default_tenant/databases/default_database/collections/{collection_name}/documents"
                requests.post(
                    document_url,
                    json={
                        "id": doc_id,
                        "embedding": embedding,
                        "content": content,
                        "metadata": {
                            "agent_name": agent_name,
                            "action_type": action_type,
                            "timestamp": datetime.now().isoformat(),
                            **(metadata or {})
                        }
                    }
                )
        except Exception as e:
            print(f"[ERROR] Failed to store client memory: {e}")

    def query_client_memory(self, client_slug, query_text, top_k=5) -> list:
        try:
            collection_name = f"client_{client_slug}_memory"
            embedding = self._get_embedding(query_text)
            if embedding is not None:
                search_url = f"{self.chroma_url}/api/v2/tenants/default_tenant/databases/default_database/collections/{collection_name}/search"
                response = requests.post(
                    search_url,
                    json={
                        "query": [embedding],
                        "n_results": top_k
                    }
                )
                response.raise_for_status()
                return response.json().get("results", [])
        except Exception as e:
            print(f"[ERROR] Failed to query client memory: {e}")
            return []

    def store_platform_pattern(self, pattern_type, situation, approach, outcome, metadata=None):
        try:
            collection_name = "platform_patterns"
            self._ensure_collection(collection_name)
            doc_id = str(uuid.uuid4())
            embedding = self._get_embedding(situation)
            if embedding is not None:
                document_url = f"{self.chroma_url}/api/v2/tenants/default_tenant/databases/default_database/collections/{collection_name}/documents"
                requests.post(
                    document_url,
                    json={
                        "id": doc_id,
                        "embedding": embedding,
                        "content": situation,
                        "metadata": {
                            "pattern_type": pattern_type,
                            "approach": approach,
                            "outcome": outcome,
                            "timestamp": datetime.now().isoformat(),
                            **(metadata or {})
                        }
                    }
                )
        except Exception as e:
            print(f"[ERROR] Failed to store platform pattern: {e}")

    def query_platform_patterns(self, situation, top_k=3) -> list:
        try:
            collection_name = "platform_patterns"
            embedding = self._get_embedding(situation)
            if embedding is not None:
                search_url = f"{self.chroma_url}/api/v2/tenants/default_tenant/databases/default_database/collections/{collection_name}/search"
                response = requests.post(
                    search_url,
                    json={
                        "query": [embedding],
                        "n_results": top_k
                    }
                )
                response.raise_for_status()
                return response.json().get("results", [])
        except Exception as e:
            print(f"[ERROR] Failed to query platform patterns: {e}")
            return []

    def summarize_client_context(self, client_slug, top_k=20) -> str:
        try:
            collection_name = f"client_{client_slug}_memory"
            search_url = f"{self.chroma_url}/api/v2/tenants/default_tenant/databases/default_database/collections/{collection_name}/search"
            response = requests.post(
                search_url,
                json={
                    "query": [],
                    "n_results": top_k
                }
            )
            response.raise_for_status()
            results = response.json().get("results", [])
            context = "\n".join([result["content"] for result in results])
            return context
        except Exception as e:
            print(f"[ERROR] Failed to summarize client context: {e}")
            return ""
