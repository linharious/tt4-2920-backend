const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/user");

const taskPopulate = [
  { path: "userId", select: "_id name email" },
  { path: "assignedUserId", select: "_id name email" },
];

const resolveAssignedUserId = async (assignedUserId) => {
  if (assignedUserId === undefined) {
    return undefined;
  }

  if (assignedUserId === null || assignedUserId === "") {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(assignedUserId)) {
    return { error: "Invalid assigned user id." };
  }

  const assignedUser = await User.findById(assignedUserId).select("_id");
  if (!assignedUser) {
    return { error: "Assigned user not found." };
  }

  return assignedUser._id;
};

/**
 * POST /tasks
 * Create a new task for the authenticated user.
 */
const createTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not authenticated" });
    }

    const { title, description, done, priority, assignedUserId } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Bad Request: title is required" });
    }

    const resolvedAssignedUserId = await resolveAssignedUserId(assignedUserId);
    if (resolvedAssignedUserId && resolvedAssignedUserId.error) {
      return res.status(400).json({ message: resolvedAssignedUserId.error });
    }

    const task = await Task.create({
      title,
      description,
      done,
      priority,
      userId: req.user.id,
      assignedUserId: resolvedAssignedUserId,
    });
    await task.populate(taskPopulate);

    return res.status(201).json({
      message: "Task created successfully.",
      data: { task },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while creating task." });
  }
};

/**
 * GET /tasks
 * Retrieve all tasks created by or assigned to the authenticated user,
 * sorted from newest to oldest.
 */
const getTasks = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not authenticated" });
    }

    const tasks = await Task.find({
      $or: [{ userId: req.user.id }, { assignedUserId: req.user.id }],
    })
      .populate(taskPopulate)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Tasks fetched successfully.",
      data: { tasks },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while fetching tasks." });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id." });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (task.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the task owner can delete this task." });
    }

    await task.deleteOne();

    return res.status(200).json({
      message: "Task Deleted successfully.",
      data: { task },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while deleting the task." });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, done, priority, assignedUserId } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id." });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const isOwner = task.userId.toString() === req.user.id;
    const isAssignedUser =
      task.assignedUserId && task.assignedUserId.toString() === req.user.id;

    if (!isOwner && !isAssignedUser) {
      return res
        .status(403)
        .json({ message: "Only owner or assigned user can update the task." });
    }

    const updatePayload = {};

    if ("done" in req.body) {
      updatePayload.done = done;
    }

    if (isOwner) {
      if ("title" in req.body) {
        updatePayload.title = title;
      }

      if ("description" in req.body) {
        updatePayload.description = description;
      }

      if ("priority" in req.body) {
        updatePayload.priority = priority;
      }

      const resolvedAssignedUserId = await resolveAssignedUserId(assignedUserId);
      if (resolvedAssignedUserId && resolvedAssignedUserId.error) {
        return res.status(400).json({ message: resolvedAssignedUserId.error });
      }

      if (resolvedAssignedUserId !== undefined) {
        updatePayload.assignedUserId = resolvedAssignedUserId;
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    }).populate(taskPopulate);

    return res.status(200).json({
      message: "Task Updated successfully.",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while updating the task." });
  }
};

module.exports = { createTask, getTasks, deleteTask, updateTask };
