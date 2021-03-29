import { connect, Db, MongoClientOptions, Collection } from "mongodb";
import { Guild } from "@models/Guild";
import { Student } from "@models/Student";

interface DatabaseConfig {
    url: string;
    name: string;
    mongoOptions?: MongoClientOptions;
}

export class Database {
    public db!: Db;
    public constructor(protected config: DatabaseConfig) { }

    public async connect(): Promise<void> {
        const client = await connect(this.config.url, this.config.mongoOptions)
            .catch(error => {
                throw error;
            });
        this.db = client.db(this.config.name);
        console.log("Connected to database");
    }

    public async getGuild(id: string): Promise<Guild | null> {
        let guild = await this.guilds.findOne({ id: id });
        if (!guild) {
            const newGuild = ({ id: id, config: {}, applications: [] });
            await this.guilds.insertOne(newGuild);
            guild = await this.guilds.findOne({ id: id });
        }

        return guild;
    }

    public async getStudent(id: string): Promise<Student | null> {
        return await this.students.findOne({ id: id });
    }

    public get guilds(): Collection<Guild> {
        return this.db.collection("guilds");
    }

    public get students(): Collection<Student> {
        return this.db.collection("students");
    }
}
