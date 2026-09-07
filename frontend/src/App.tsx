import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type SupportRequest = {
  request_id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  created_by: string;
  status: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};

type Comment = {
  comment_id: number;
  request_id: number;
  author: string;
  message: string;
  created_at: string;
};

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [createdBy, setCreatedBy] = useState("");

  const [assignees, setAssignees] = useState<
    Record<number, string>
  >({});

  const [comments, setComments] = useState<
    Record<number, Comment[]>
  >({});

  const [commentAuthors, setCommentAuthors] = useState<
    Record<number, string>
  >({});

  const [commentMessages, setCommentMessages] = useState<
    Record<number, string>
  >({});

  const [commentsOpen, setCommentsOpen] = useState<
    Record<number, boolean>
  >({});

  const [loadingComments, setLoadingComments] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    fetch(`${API_URL}/requests/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load requests");
        }

        return response.json();
      })
      .then((data: SupportRequest[]) => {
        setRequests(data);
      })
      .catch((error) => {
        console.error("Error loading requests:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          created_by: createdBy,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create request");
      }

      const newRequest: SupportRequest =
        await response.json();

      setRequests((currentRequests) => [
        ...currentRequests,
        newRequest,
      ]);

      setTitle("");
      setDescription("");
      setCategory("General");
      setPriority("Medium");
      setCreatedBy("");
      setShowForm(false);
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Unable to create request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (
    requestId: number,
    newStatus: string
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/requests/${requestId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedRequest: SupportRequest =
        await response.json();

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.request_id === requestId
            ? updatedRequest
            : request
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Unable to update request status.");
    }
  };

  const handleAssign = async (
    requestId: number,
    requestPriority: string
  ) => {
    const assignedTo = assignees[requestId]?.trim();

    if (!assignedTo) {
      alert("Please enter the person to assign.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/requests/${requestId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assigned_to: assignedTo,
            priority: requestPriority,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign request");
      }

      const updatedRequest: SupportRequest =
        await response.json();

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.request_id === requestId
            ? updatedRequest
            : request
        )
      );

      setAssignees((current) => ({
        ...current,
        [requestId]: "",
      }));
    } catch (error) {
      console.error("Error assigning request:", error);
      alert("Unable to assign request.");
    }
  };

  const loadComments = async (requestId: number) => {
    setLoadingComments((current) => ({
      ...current,
      [requestId]: true,
    }));

    try {
      const response = await fetch(
        `${API_URL}/requests/${requestId}/comments`
      );

      if (!response.ok) {
        throw new Error("Failed to load comments");
      }

      const data: Comment[] = await response.json();

      setComments((current) => ({
        ...current,
        [requestId]: data,
      }));
    } catch (error) {
      console.error("Error loading comments:", error);
      alert("Unable to load comments.");
    } finally {
      setLoadingComments((current) => ({
        ...current,
        [requestId]: false,
      }));
    }
  };

  const toggleComments = async (requestId: number) => {
    const currentlyOpen =
      commentsOpen[requestId] || false;

    setCommentsOpen((current) => ({
      ...current,
      [requestId]: !currentlyOpen,
    }));

    if (
      !currentlyOpen &&
      comments[requestId] === undefined
    ) {
      await loadComments(requestId);
    }
  };

  const handleAddComment = async (
    requestId: number,
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const author =
      commentAuthors[requestId]?.trim();

    const message =
      commentMessages[requestId]?.trim();

    if (!author || !message) {
      alert("Please enter author and comment.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/requests/${requestId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author,
            message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment: Comment =
        await response.json();

      setComments((current) => ({
        ...current,
        [requestId]: [
          ...(current[requestId] || []),
          newComment,
        ],
      }));

      setCommentAuthors((current) => ({
        ...current,
        [requestId]: "",
      }));

      setCommentMessages((current) => ({
        ...current,
        [requestId]: "",
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Unable to add comment.");
    }
  };

  const openRequests = requests.filter(
    (request) =>
      request.status !== "Resolved" &&
      request.status !== "Closed"
  ).length;

  const resolvedRequests = requests.filter(
    (request) =>
      request.status === "Resolved"
  ).length;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Client Request & Support</h1>
          <p>
            Manage and track client support requests
          </p>
        </div>

        <button
          className="new-request-button"
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          {showForm
            ? "Cancel"
            : "+ New Request"}
        </button>
      </header>

      <main className="content">
        {showForm && (
          <section className="request-form-section">
            <h2>Create New Request</h2>

            <form
              className="request-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label htmlFor="title">
                  Title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  minLength={3}
                  maxLength={150}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  minLength={10}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">
                    Category
                  </label>

                  <input
                    id="category"
                    type="text"
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target.value
                      )
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="priority">
                    Priority
                  </label>

                  <select
                    id="priority"
                    value={priority}
                    onChange={(event) =>
                      setPriority(
                        event.target.value
                      )
                    }
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Urgent">
                      Urgent
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="createdBy">
                  Created By
                </label>

                <input
                  id="createdBy"
                  type="text"
                  value={createdBy}
                  onChange={(event) =>
                    setCreatedBy(
                      event.target.value
                    )
                  }
                  minLength={2}
                  required
                />
              </div>

              <button
                className="submit-button"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Creating..."
                  : "Create Request"}
              </button>
            </form>
          </section>
        )}

        <section className="stats">
          <div className="stat-card">
            <span>Total Requests</span>
            <strong>{requests.length}</strong>
          </div>

          <div className="stat-card">
            <span>Open Requests</span>
            <strong>{openRequests}</strong>
          </div>

          <div className="stat-card">
            <span>Resolved</span>
            <strong>{resolvedRequests}</strong>
          </div>
        </section>

        <section className="request-section">
          <h2>Support Requests</h2>

          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            <div className="request-list">
              {requests.map((request) => (
                <div
                  className="request-card"
                  key={request.request_id}
                >
                  <div className="request-card-header">
                    <div>
                      <span className="request-id">
                        #{request.request_id}
                      </span>

                      <h3>{request.title}</h3>
                    </div>

                    <span className="status-badge">
                      {request.status}
                    </span>
                  </div>

                  <p>{request.description}</p>

                  <div className="request-details">
                    <span>
                      <strong>
                        Category:
                      </strong>{" "}
                      {request.category}
                    </span>

                    <span>
                      <strong>
                        Priority:
                      </strong>{" "}
                      {request.priority}
                    </span>

                    <span>
                      <strong>
                        Created by:
                      </strong>{" "}
                      {request.created_by}
                    </span>

                    <span>
                      <strong>
                        Assigned to:
                      </strong>{" "}
                      {request.assigned_to ||
                        "Not assigned"}
                    </span>
                  </div>

                  <div className="request-actions">
                    <label
                      htmlFor={`status-${request.request_id}`}
                    >
                      Status:
                    </label>

                    <select
                      id={`status-${request.request_id}`}
                      value={request.status}
                      onChange={(event) =>
                        handleStatusChange(
                          request.request_id,
                          event.target.value
                        )
                      }
                    >
                      <option value="New">
                        New
                      </option>

                      <option value="In Review">
                        In Review
                      </option>

                      <option value="Assigned">
                        Assigned
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="More Info Required">
                        More Info Required
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                      <option value="Closed">
                        Closed
                      </option>
                    </select>
                  </div>

                  <div className="assignment-actions">
                    <label
                      htmlFor={`assign-${request.request_id}`}
                    >
                      Assign to:
                    </label>

                    <input
                      id={`assign-${request.request_id}`}
                      type="text"
                      placeholder="Support Engineer"
                      value={
                        assignees[
                          request.request_id
                        ] || ""
                      }
                      onChange={(event) =>
                        setAssignees(
                          (current) => ({
                            ...current,
                            [request.request_id]:
                              event.target.value,
                          })
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleAssign(
                          request.request_id,
                          request.priority
                        )
                      }
                    >
                      Assign
                    </button>
                  </div>

                  <div className="comments-area">
                    <button
                      type="button"
                      className="comments-toggle"
                      onClick={() =>
                        toggleComments(
                          request.request_id
                        )
                      }
                    >
                      {commentsOpen[
                        request.request_id
                      ]
                        ? "Hide Comments"
                        : "View Comments"}
                    </button>

                    {commentsOpen[
                      request.request_id
                    ] && (
                      <div className="comments-content">
                        <h4>Comments</h4>

                        {loadingComments[
                          request.request_id
                        ] ? (
                          <p>
                            Loading comments...
                          </p>
                        ) : (
                          comments[
                            request.request_id
                          ] || []
                        ).length === 0 ? (
                          <p className="no-comments">
                            No comments yet.
                          </p>
                        ) : (
                          <div className="comment-list">
                            {(
                              comments[
                                request.request_id
                              ] || []
                            ).map((comment) => (
                              <div
                                className="comment-item"
                                key={
                                  comment.comment_id
                                }
                              >
                                <strong>
                                  {comment.author}
                                </strong>

                                <p>
                                  {comment.message}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        <form
                          className="comment-form"
                          onSubmit={(event) =>
                            handleAddComment(
                              request.request_id,
                              event
                            )
                          }
                        >
                          <input
                            type="text"
                            placeholder="Your name"
                            value={
                              commentAuthors[
                                request.request_id
                              ] || ""
                            }
                            onChange={(event) =>
                              setCommentAuthors(
                                (current) => ({
                                  ...current,
                                  [request.request_id]:
                                    event.target
                                      .value,
                                })
                              )
                            }
                            minLength={2}
                            required
                          />

                          <textarea
                            placeholder="Add a comment..."
                            value={
                              commentMessages[
                                request.request_id
                              ] || ""
                            }
                            onChange={(event) =>
                              setCommentMessages(
                                (current) => ({
                                  ...current,
                                  [request.request_id]:
                                    event.target
                                      .value,
                                })
                              )
                            }
                            minLength={2}
                            required
                          />

                          <button type="submit">
                            Add Comment
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;