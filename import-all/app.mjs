import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE = "test-table";
const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (event, context) => {
  const params = {
    TableName: "test-table",
  };

  try {
    console.log("incoming eventg is?", event);

    for (let i = 0; i < event.data.length; i++) {
      const data = await docClient.send(
        new PutCommand({
          TableName: "test-table",
          Item: event.data[i],
        })
      );
      console.log("Success - item added or updated", data);
    }

    // event.data.forEach((element) => {
    //   console.log("element si?", element);

    // });

    return {
      statusCode: 200,
      body: JSON.stringify(JSON.stringify(event)),
    };
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
