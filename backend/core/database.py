from motor.motor_asyncio import AsyncIOMotorClient
from core.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    """Create database connection."""
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)

async def close_mongo_connection():
    """Close database connection."""
    db.client.close()

def get_database():
    """Get database instance."""
    return db.client[settings.DATABASE_NAME]

def get_collection(collection_name: str):
    """Get a specific collection from the database."""
    database = get_database()
    return database[collection_name]
