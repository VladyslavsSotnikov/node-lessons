import { MongoClient, ServerApiVersion } from "mongodb";

const user = encodeURIComponent("vladSotnikov");
const password = encodeURIComponent("Silvi031134Vlad#");
const uri = `mongodb+srv://${user}:${password}@test-db-cluster.mkkezac.mongodb.net/?appName=Test-db-cluster`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const mongoDB = client.db("shop");
export const coursesCollection = mongoDB.collection<CourseType>("courses");

export async function runDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!!");
  } catch (error) {
    await client.close();
  }
}

export type CourseType = {
  id: number;
  title: string;
  studentsCount: number;
};

export const db: { courses: CourseType[] } = {
  courses: [
    { id: 1, title: "frontend", studentsCount: 10 },
    { id: 2, title: "backend", studentsCount: 20 },
    { id: 3, title: "fullstack", studentsCount: 30 },
  ],
};

export type DBType = typeof db;
