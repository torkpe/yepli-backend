import socketIO from "socket.io";
import Conversation from "../modules/conversations/model";
import Task from "../modules/tasks/model";
import mongoose from "mongoose";
import { USER_COLLECTION } from "../modules/auth/model";

const { ObjectId } = mongoose.Types;

export default function socketServer(server) {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const getConversations = (payload) => {
    const query = {
      isDeleted: false
    };

    if (payload.dealId) {
      query.dealId = ObjectId(payload.dealId);
    }

    if (payload.taskId) {
      query.taskId = ObjectId(payload.taskId);
    }
    Conversation.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: USER_COLLECTION,
          foreignField: "_id",
          localField: "userId",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: USER_COLLECTION,
          foreignField: "_id",
          localField: "mentions",
          as: "mentions",
        },
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          createdAt: 1
        }
      }
    ]).then((conversations) =>{
      console.log(conversations, '$$$$$$$')
      io.sockets.emit("get_converations", conversations)}
    );
  }

  io.on("connection", (socket) => {
    console.log("New client connected" + socket.id);

    socket.on("request_converations", (dealId) => {
      console.log(dealId, "=====");
      getConversations({dealId});
      console.log("got here");
    });

    socket.on("get_conversations_for_tasks", (taskId) => {
      getConversations({taskId});
      console.log("got here");
    });

    socket.on("delete_conversation", ({ conversationId, taskId, dealId }) => {
      Conversation.findByIdAndDelete(conversationId).then(() => {
        if (taskId) {
          getConversations({ taskId })
          console.log(conversationId, taskId, '@@@@@@@@@')
        } else {
          getConversations({ dealId })
        }
      });
    });

    socket.on("update_conversation", ({ conversationId, comment, mentions, taskId }) => {
      console.log(conversationId, '##########======>>>>>>>')
      Conversation.updateOne({
        _id: conversationId,
      }, {
        $set: {
          comment
        }
      }).then(() => {
        console.log('updated comment')
        if (taskId) {
          getConversations({ taskId })
          Task.findOne({
            _id: taskId
          }).then(task => {
            if (task.mentions) {
              mentions = [...task.mentions, ...mentions]
            };

            Task.updateOne({
              _id: taskId
            }, {
              $set: {
                mentions,
              }
            })
          })
          console.log(conversationId, taskId, '@@@@@@@@@')
        } else {
          getConversations({ dealId })
        }
      });
    });

    socket.on("add_conversation", (payload) => {
      console.log(payload, "=====");
      Conversation.create(payload).then((conversation) => {
        console.log(conversation);
        Task.updateOne({
          _id: payload.taskId,
        }, {
          $set: {mentions: payload.mentions}
        }).then(() => console.log('updated'));
        getConversations(payload)
      });
      console.log("got here");
    });
  });
}
