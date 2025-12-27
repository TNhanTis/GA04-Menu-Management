import { useState, useEffect } from "react";
import { menuItemsApi } from "../api/menuItemsApi";
import type {
  MenuItem,
  CreateMenuItemData,
  UpdateMenuItemData,
} from "../api/menuItemsApi";
import axios from "axios";
import "../App.css";

// Import category and modifier APIs
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Category {
  id: string;
  name: string;
  status: string;
}

interface ModifierGroup {
  id: string;
  name: string;
  status: string;
}

export default function MenuItemsManagement() {
  const RESTAURANT_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

  // Data states
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [chefRecommendedFilter, setChefRecommendedFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Form data
  const [formData, setFormData] = useState<CreateMenuItemData>({
    restaurant_id: RESTAURANT_ID,
    category_id: "",
    name: "",
    description: "",
    price: 0,
    prep_time_minutes: 0,
    status: "available",
    is_chef_recommended: false,
    modifier_group_ids: [],
  });

  // Load menu items
  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuItemsApi.getAll(RESTAURANT_ID, {
        search: searchQuery || undefined,
        category_id: categoryFilter || undefined,
        status: statusFilter || undefined,
        is_chef_recommended: chefRecommendedFilter || undefined,
        sortBy,
        page: currentPage,
        limit: itemsPerPage,
      });

      setItems(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.total);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load menu items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/menu/categories?status=active`
      );
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  // Load modifier groups
  const loadModifierGroups = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/admin/menu/modifier-groups?status=active`
      );
      setModifierGroups(response.data);
    } catch (err) {
      console.error("Failed to load modifier groups", err);
    }
  };

  // Initial load
  useEffect(() => {
    loadCategories();
    loadModifierGroups();
  }, []);

  // Reload items when filters change
  useEffect(() => {
    loadMenuItems();
  }, [
    searchQuery,
    categoryFilter,
    statusFilter,
    chefRecommendedFilter,
    sortBy,
    currentPage,
  ]);

  // Handle create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.category_id) {
      alert("Please select a category");
      return;
    }
    if (formData.name.length < 2 || formData.name.length > 80) {
      alert("Name must be between 2 and 80 characters");
      return;
    }
    if (formData.price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    try {
      await menuItemsApi.create(formData);
      setShowCreateModal(false);
      resetForm();
      loadMenuItems();
      alert("Menu item created successfully!");
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Failed to create menu item. Please check your input."
      );
      console.error(err);
    }
  };

  // Handle edit
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const updateData: UpdateMenuItemData = {
      category_id: formData.category_id || undefined,
      name: formData.name || undefined,
      description: formData.description || undefined,
      price: formData.price || undefined,
      prep_time_minutes: formData.prep_time_minutes || undefined,
      status: formData.status || undefined,
      is_chef_recommended: formData.is_chef_recommended,
      modifier_group_ids: formData.modifier_group_ids,
    };

    try {
      await menuItemsApi.update(selectedItem.id, updateData);
      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
      loadMenuItems();
      alert("Menu item updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update menu item");
      console.error(err);
    }
  };

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await menuItemsApi.delete(id);
      loadMenuItems();
      alert("Menu item deleted successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete menu item");
      console.error(err);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await menuItemsApi.updateStatus(id, newStatus);
      loadMenuItems();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update status");
      console.error(err);
    }
  };

  // Open edit modal
  const openEditModal = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      restaurant_id: RESTAURANT_ID,
      category_id: item.category.id,
      name: item.name,
      description: item.description || "",
      price: item.price,
      prep_time_minutes: item.prepTimeMinutes,
      status: item.status,
      is_chef_recommended: item.isChefRecommended,
      modifier_group_ids: item.modifierGroups?.map((g) => g.id) || [],
    });
    setShowEditModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      restaurant_id: RESTAURANT_ID,
      category_id: "",
      name: "",
      description: "",
      price: 0,
      prep_time_minutes: 0,
      status: "available",
      is_chef_recommended: false,
      modifier_group_ids: [],
    });
  };

  // Toggle modifier group selection
  const toggleModifierGroup = (groupId: string) => {
    const currentIds = formData.modifier_group_ids || [];
    if (currentIds.includes(groupId)) {
      setFormData({
        ...formData,
        modifier_group_ids: currentIds.filter((id) => id !== groupId),
      });
    } else {
      setFormData({
        ...formData,
        modifier_group_ids: [...currentIds, groupId],
      });
    }
  };

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>🍽️ Menu Items Management</h1>
          <p>Manage your restaurant menu items</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          ➕ Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="🔍 Search by name or description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{ flex: "1", minWidth: "200px" }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ minWidth: "150px" }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ minWidth: "150px" }}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="sold_out">Sold Out</option>
          </select>

          <select
            value={chefRecommendedFilter}
            onChange={(e) => {
              setChefRecommendedFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ minWidth: "150px" }}
          >
            <option value="">All Items</option>
            <option value="true">Chef Recommended</option>
            <option value="false">Not Recommended</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            style={{ minWidth: "150px" }}
          >
            <option value="created_at_desc">Newest First</option>
            <option value="created_at_asc">Oldest First</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p style={{ color: "#666", marginBottom: "10px" }}>
        Showing {items.length} of {totalItems} items
      </p>

      {/* Error */}
      {error && (
        <div style={{ color: "red", padding: "10px", background: "#ffe6e6", borderRadius: "5px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <p>Loading menu items...</p>}

      {/* Table */}
      {!loading && items.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Prep Time</th>
                <th>Status</th>
                <th>Chef Rec.</th>
                <th>Modifiers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.primaryPhoto ? (
                      <img
                        src={item.primaryPhoto}
                        alt={item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/50?text=No+Image";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          background: "#f0f0f0",
                          borderRadius: "5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        🍽️
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                    {item.description && (
                      <div
                        style={{
                          fontSize: "0.85em",
                          color: "#666",
                          marginTop: "3px",
                        }}
                      >
                        {item.description.substring(0, 50)}
                        {item.description.length > 50 ? "..." : ""}
                      </div>
                    )}
                  </td>
                  <td>{item.category.name}</td>
                  <td style={{ fontWeight: "bold" }}>
                    {formatPrice(item.price)}
                  </td>
                  <td>{item.prepTimeMinutes} mins</td>
                  <td>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusUpdate(item.id, e.target.value)
                      }
                      className={`status-badge status-${item.status}`}
                      style={{
                        border: "none",
                        borderRadius: "15px",
                        padding: "5px 10px",
                        fontSize: "0.85em",
                        cursor: "pointer",
                      }}
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                      <option value="sold_out">Sold Out</option>
                    </select>
                  </td>
                  <td>{item.isChefRecommended ? "⭐" : "-"}</td>
                  <td>{item.modifierGroupsCount || 0}</td>
                  <td>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        className="btn-icon"
                        onClick={() => openEditModal(item)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(item.id, item.name)}
                        title="Delete"
                        style={{ color: "red" }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No results */}
      {!loading && items.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          <p>No menu items found. Create your first item!</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "5px" }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="btn"
          >
            ← Previous
          </button>
          <span style={{ padding: "8px 15px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Menu Item</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>
                  Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Enter item name (2-80 characters)"
                />
              </div>

              <div className="form-group">
                <label>
                  Category <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  maxLength={500}
                  placeholder="Enter item description (optional)"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="form-group">
                  <label>
                    Price (VND) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                    min={0.01}
                    step={1000}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Prep Time (minutes)</label>
                  <input
                    type="number"
                    value={formData.prep_time_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prep_time_minutes: parseInt(e.target.value) || 0,
                      })
                    }
                    min={0}
                    max={240}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_chef_recommended}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_chef_recommended: e.target.checked,
                      })
                    }
                  />
                  Chef Recommended
                </label>
              </div>

              <div className="form-group">
                <label>Modifier Groups (Optional)</label>
                <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
                  {modifierGroups.length === 0 && (
                    <p style={{ color: "#999", fontSize: "0.9em" }}>
                      No modifier groups available
                    </p>
                  )}
                  {modifierGroups.map((group) => (
                    <label
                      key={group.id}
                      style={{
                        display: "block",
                        padding: "5px 0",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.modifier_group_ids?.includes(
                          group.id
                        )}
                        onChange={() => toggleModifierGroup(group.id)}
                      />
                      {group.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Menu Item</h2>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label>
                  Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  minLength={2}
                  maxLength={80}
                />
              </div>

              <div className="form-group">
                <label>
                  Category <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="form-group">
                  <label>
                    Price (VND) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                    min={0.01}
                    step={1000}
                  />
                </div>

                <div className="form-group">
                  <label>Prep Time (minutes)</label>
                  <input
                    type="number"
                    value={formData.prep_time_minutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prep_time_minutes: parseInt(e.target.value) || 0,
                      })
                    }
                    min={0}
                    max={240}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_chef_recommended}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_chef_recommended: e.target.checked,
                      })
                    }
                  />
                  Chef Recommended
                </label>
              </div>

              <div className="form-group">
                <label>Modifier Groups</label>
                <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #ddd", padding: "10px", borderRadius: "5px" }}>
                  {modifierGroups.map((group) => (
                    <label
                      key={group.id}
                      style={{
                        display: "block",
                        padding: "5px 0",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.modifier_group_ids?.includes(
                          group.id
                        )}
                        onChange={() => toggleModifierGroup(group.id)}
                      />
                      {group.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
