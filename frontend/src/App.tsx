import { useEffect, useState, type FormEvent } from "react";
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

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const statuses = [
  "New",
  "In Review",
  "Assigned",
  "In Progress",
  "More Info Required",
  "Resolved",
  "Closed",
];

const priorities = ["Low", "Medium", "High", "Urgent"];

function App() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [createdBy, setCreatedBy] = useState("");

  const [assignees, setAssignees] = useState<Record<number, string>>({});
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [commentAuthors, setCommentAuthors] = useState<
    Record<number, string>
  >({});
  const [commentMessages, setCommentMessages] = useState<
    Record<number, string>
  >({});
  const [showComments, setShowComments] = useState<Record<number, boolean>>(
    {},
  );
  const [commentLoading, setCommentLoading] = useState<
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
        console.error("Failed to load requests:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const loadRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/requests/`);

      if (!response.ok) {
        throw new Error("Failed to load requests");
      }

      const data: SupportRequest[] = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to load requests:", error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

      setTitle("");
      setDescription("");
      setCategory("General");
      setPriority("Medium");
      setCreatedBy("");

      await loadRequests();
    } catch (error) {
      console.error("Failed to create request:", error);
      alert("Unable to create request.");
    }
  };

  const handleStatusChange = async (
    requestId: number,
    newStatus: string,
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
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      await loadRequests();
    } catch (error) {
      console.error("Failed to update request status:", error);
      alert("Unable to update request status.");
    }
  };

  const handleAssign = async (requestId: number) => {
    const assignedTo = assignees[requestId]?.trim();

    if (!assignedTo) {
      alert("Enter a person to assign this request to.");
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
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to assign request");
      }

      setAssignees((current) => ({
        ...current,
        [requestId]: "",
      }));

      await loadRequests();
    } catch (error) {
      console.error("Failed to assign request:", error);
      alert("Unable to assign request.");
    }
  };

  const loadComments = async (requestId: number) => {
    setCommentLoading((current) => ({
      ...current,
      [requestId]: true,
    }));

    try {
      const response = await fetch(
        `${API_URL}/requests/${requestId}/comments`,
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
      console.error("Failed to load comments:", error);
    } finally {
      setCommentLoading((current) => ({
        ...current,
        [requestId]: false,
      }));
    }
  };

  const toggleComments = async (requestId: number) => {
    const currentlyVisible = showComments[requestId] ?? false;

    setShowComments((current) => ({
      ...current,
      [requestId]: !currentlyVisible,
    }));

    if (!currentlyVisible) {
      await loadComments(requestId);
    }
  };

  const handleAddComment = async (requestId: number) => {
    const author = commentAuthors[requestId]?.trim();
    const message = commentMessages[requestId]?.trim();

    if (!author || !message) {
      alert("Enter both your name and a comment.");
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
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      setCommentMessages((current) => ({
        ...current,
        [requestId]: "",
      }));

      await loadComments(requestId);
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Unable to add comment.");
    }
  };

  const totalRequests = requests.length;

  const activeRequests = requests.filter(
    (request) =>
      request.status !== "Resolved" && request.status !== "Closed",
  ).length;

  const resolvedRequests = requests.filter(
    (request) => request.status === "Resolved",
  ).length;

  const urgentRequests = requests.filter(
    (request) => request.priority === "Urgent",
  ).length;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Client Request & Support Workflow Platform</h1>
          <p>
            Submit, manage, assign, track, and resolve client support
            requests.
          </p>
        </div>
      </header>

      <main className="app-main">
        <section className="request-form-section">
          <h2>Create Support Request</h2>

          <form className="request-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter request title"
                minLength={3}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the issue or request"
                minLength={10}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="General"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                >
                  {priorities.map((priorityOption) => (
                    <option key={priorityOption} value={priorityOption}>
                      {priorityOption}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="createdBy">Created By</label>
                <input
                  id="createdBy"
                  type="text"
                  value={createdBy}
                  onChange={(event) => setCreatedBy(event.target.value)}
                  placeholder="Your name"
                  minLength={2}
                  required
                />
              </div>
            </div>

            <button className="primary-button" type="submit">
              Submit Request
            </button>
          </form>
        </section>

        <section className="dashboard-section">
          <h2>Support Dashboard</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Total Requests</span>
              <strong>{totalRequests}</strong>
            </div>

            <div className="stat-card">
              <span>Active</span>
              <strong>{activeRequests}</strong>
            </div>

            <div className="stat-card">
              <span>Resolved</span>
              <strong>{resolvedRequests}</strong>
            </div>

            <div className="stat-card">
              <span>Urgent</span>
              <strong>{urgentRequests}</strong>
            </div>
          </div>
        </section>

        <section className="requests-section">
          <div className="section-heading">
            <h2>Support Requests</h2>

            <button
              className="secondary-button"
              type="button"
              onClick={loadRequests}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p>No support requests yet.</p>
          ) : (
            <div className="requests-grid">
              {requests.map((request) => (
                <article className="request-card" key={request.request_id}>
                  <div className="request-card-header">
                    <div>
                      <span className="request-id">
                        Request #{request.request_id}
                      </span>

                      <h3>{request.title}</h3>
                    </div>

                    <span
                      className={`priority priority-${request.priority.toLowerCase()}`}
                    >
                      {request.priority}
                    </span>
                  </div>

                  <p className="request-description">
                    {request.description}
                  </p>

                  <div className="request-details">
                    <p>
                      <strong>Category:</strong> {request.category}
                    </p>

                    <p>
                      <strong>Created by:</strong> {request.created_by}
                    </p>

                    <p>
                      <strong>Assigned to:</strong>{" "}
                      {request.assigned_to || "Not assigned"}
                    </p>

                    <p>
                      <strong>Status:</strong> {request.status}
                    </p>
                  </div>

                  <div className="request-actions">
                    <div className="action-group">
                      <label
                        htmlFor={`status-${request.request_id}`}
                      >
                        Update Status
                      </label>

                      <select
                        id={`status-${request.request_id}`}
                        value={request.status}
                        onChange={(event) =>
                          handleStatusChange(
                            request.request_id,
                            event.target.value,
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="action-group">
                      <label
                        htmlFor={`assign-${request.request_id}`}
                      >
                        Assign Request
                      </label>

                      <div className="inline-action">
                        <input
                          id={`assign-${request.request_id}`}
                          type="text"
                          placeholder="Support agent"
                          value={assignees[request.request_id] ?? ""}
                          onChange={(event) =>
                            setAssignees((current) => ({
                              ...current,
                              [request.request_id]: event.target.value,
                            }))
                          }
                        />

                        <button
                          className="secondary-button"
                          type="button"
                          onClick={() =>
                            handleAssign(request.request_id)
                          }
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="comments-section">
                    <button
                      className="comments-toggle"
                      type="button"
                      onClick={() =>
                        toggleComments(request.request_id)
                      }
                    >
                      {showComments[request.request_id]
                        ? "Hide Comments"
                        : "View Comments"}
                    </button>

                    {showComments[request.request_id] && (
                      <div className="comments-content">
                        {commentLoading[request.request_id] ? (
                          <p>Loading comments...</p>
                        ) : (
                          <>
                            <div className="comments-list">
                              {(comments[request.request_id] ?? [])
                                .length === 0 ? (
                                <p>No comments yet.</p>
                              ) : (
                                (comments[request.request_id] ?? []).map(
                                  (comment) => (
                                    <div
                                      className="comment"
                                      key={comment.comment_id}
                                    >
                                      <strong>{comment.author}</strong>

                                      <p>{comment.message}</p>

                                      <small>
                                        {new Date(
                                          comment.created_at,
                                        ).toLocaleString()}
                                      </small>
                                    </div>
                                  ),
                                )
                              )}
                            </div>

                            <div className="comment-form">
                              <input
                                type="text"
                                placeholder="Your name"
                                value={
                                  commentAuthors[
                                    request.request_id
                                  ] ?? ""
                                }
                                onChange={(event) =>
                                  setCommentAuthors((current) => ({
                                    ...current,
                                    [request.request_id]:
                                      event.target.value,
                                  }))
                                }
                              />

                              <textarea
                                placeholder="Add a comment"
                                value={
                                  commentMessages[
                                    request.request_id
                                  ] ?? ""
                                }
                                onChange={(event) =>
                                  setCommentMessages((current) => ({
                                    ...current,
                                    [request.request_id]:
                                      event.target.value,
                                  }))
                                }
                              />

                              <button
                                className="primary-button"
                                type="button"
                                onClick={() =>
                                  handleAddComment(request.request_id)
                                }
                              >
                                Add Comment
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;