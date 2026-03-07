from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Gap2Grow API"
    API_V1_STR: str = "/api"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "gap2grow_db"

settings = Settings()
