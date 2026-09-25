import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/expenses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }
        return response.json();
      })
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to connect to the server.");
        setLoading(false);
      });
  }, []);

  function resetForm() {
    setTitle("");
    setAmount("");
    setEditingIndex(null);
  }

  function validateForm() {
    if (!title.trim()) {
      setError("Please enter an expense title.");
      return false;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Amount must be greater than 0.");
      return false;
    }

    setError("");
    return true;
  }

  function addExpense() {
    if (!validateForm()) return;

    const newExpense = {
      title: title.trim(),
      amount: Number(amount),
    };

    fetch("http://localhost:8080/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpense),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add expense");
        }
        return response.json();
      })
      .then((data) => {
        setExpenses((prevExpenses) => [...prevExpenses, data]);
        resetForm();
      })
      .catch(() => {
        setError("Could not add expense.");
      });
  }

  function deleteExpense(id) {
    fetch(`http://localhost:8080/expenses/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete expense");
        }

        setExpenses((prevExpenses) =>
          prevExpenses.filter((expense) => expense.id !== id)
        );
      })
      .catch(() => {
        setError("Could not delete expense.");
      });
  }

  function editExpense(index) {
    setEditingIndex(index);
    setTitle(expenses[index].title);
    setAmount(expenses[index].amount);
    setError("");
  }

  function updateExpense() {
    if (!validateForm()) return;

    const id = expenses[editingIndex].id;

    const updatedExpense = {
      title: title.trim(),
      amount: Number(amount),
    };

    fetch(`http://localhost:8080/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedExpense),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update expense");
        }
        return response.json();
      })
      .then((data) => {
        setExpenses((prevExpenses) =>
          prevExpenses.map((expense, index) =>
            index === editingIndex ? data : expense
          )
        );

        resetForm();
      })
      .catch(() => {
        setError("Could not update expense.");
      });
  }

  const filteredExpenses = expenses
    .filter((expense) =>
      expense.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "highest") {
        return Number(b.amount) - Number(a.amount);
      }

      if (sort === "lowest") {
        return Number(a.amount) - Number(b.amount);
      }

      return b.id - a.id;
    });

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">PERSONAL FINANCE</p>
          <h1>Expense Tracker</h1>
          <p className="subtitle">
            Track your spending and stay in control.
          </p>
        </div>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat-card">
            <span>Total Expenses</span>
            <strong>₹{totalExpenses.toLocaleString("en-IN")}</strong>
          </div>

          <div className="stat-card">
            <span>Transactions</span>
            <strong>{expenses.length}</strong>
          </div>

          <div className="stat-card">
            <span>Highest Expense</span>
            <strong>
              ₹
              {expenses.length
                ? Math.max(
                    ...expenses.map((expense) => Number(expense.amount))
                  ).toLocaleString("en-IN")
                : "0"}
            </strong>
          </div>
        </section>

        <section className="form-card">
          <div className="section-heading">
            <div>
              <h2>{editingIndex === null ? "Add Expense" : "Edit Expense"}</h2>
              <p>
                {editingIndex === null
                  ? "Enter the details of your expense."
                  : "Update the selected expense."}
              </p>
            </div>
          </div>

          <div className="form">
            <div className="input-group">
              <label>Expense Title</label>
              <input
                type="text"
                placeholder="e.g. Groceries"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Amount</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button
              className="primary-button"
              onClick={editingIndex === null ? addExpense : updateExpense}
            >
              {editingIndex === null ? "+ Add Expense" : "Update Expense"}
            </button>

            {editingIndex !== null && (
              <button className="cancel-button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>

          {error && <p className="error">{error}</p>}
        </section>

        <section className="expenses-section">
          <div className="toolbar">
            <div>
              <h2>Your Expenses</h2>
              <p>{expenses.length} total transactions</p>
            </div>

            <div className="controls">
              <input
                className="search"
                type="text"
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="latest">Latest</option>
                <option value="highest">Highest amount</option>
                <option value="lowest">Lowest amount</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Loading expenses...</div>
          ) : filteredExpenses.length === 0 ? (
            <div className="empty-state">
              <h3>No expenses found</h3>
              <p>Add an expense or try another search.</p>
            </div>
          ) : (
            <div className="expense-list">
              {filteredExpenses.map((expense) => (
                <div className="expense-item" key={expense.id}>
                  <div className="expense-info">
                    <div className="expense-icon">₹</div>

                    <div>
                      <h3>{expense.title}</h3>
                      <span>Expense #{expense.id}</span>
                    </div>
                  </div>

                  <div className="expense-actions">
                    <strong>
                      ₹{Number(expense.amount).toLocaleString("en-IN")}
                    </strong>

                    <button
                      className="edit-button"
                      onClick={() =>
                        editExpense(
                          expenses.findIndex(
                            (item) => item.id === expense.id
                          )
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      Delete
                    </button>
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