import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE = "test-table";
const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const deleteItem = (table, id) => {
  console.log("id", id);
  var params = {
    TableName: table,
    Key: {
      key: id,
    },
  };
  return docClient.send(new DeleteCommand(params));
};

const getAllRecords = async (table) => {
  let params = {
    TableName: table,
  };
  let items = [];
  let data = await docClient.send(new ScanCommand(params));
  items = [...items, ...data.Items];
  while (typeof data.LastEvaluatedKey != "undefined") {
    params.ExclusiveStartKey = data.LastEvaluatedKey;
    data = await docClient.send(new ScanCommand(params));
    items = [...items, ...data.Items];
  }
  return items;
};

export const lambdaHandler = async (event, context) => {
  const params = {
    TableName: "test-table",
  };

  try {
    const allRecords = await getAllRecords(TABLE);
    console.log("allRecords", allRecords);
    for (const item of allRecords) {
      console.log("what is it?", item);
      await deleteItem(TABLE, item.key);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(allRecords),
    };
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
