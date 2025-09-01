"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
} from "lucide-react";

const ViewAllCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const addCategoryMutation = useMutation(api.categories.addCategory);
  const categories = useQuery(api.categories.getCategories);
  const deleteCategory = useMutation(api.categories.deleteCategory);
  const editCategory = useMutation(api.categories.editCategory);

  if (!categories) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading categories...</span>
      </div>
    );
  }

  // Filter and sort categories
  const filteredCategories = categories
    .filter((category) => {
      const matchesSearch = category.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
          break;
        case "createdAt":
          aValue = new Date(a._creationTime || 0);
          bValue = new Date(b._creationTime || 0);
          break;
        default:
          aValue = a.name?.toLowerCase() || "";
          bValue = b.name?.toLowerCase() || "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleAddCategory = async () => {
    const name = prompt("Enter category name:");
    if (!name) return;
    const res = await addCategoryMutation({ name });
    alert(`Category added with slug: ${res.slug}`);
  };
  const handleEdit = (categoryId: string, currentName: string) => {
    setEditingId(categoryId);
    setEditValue(currentName);
  };

  const handleSaveEdit = async (categoryId: string) => {
    await editCategory({ id: categoryId as any, name: editValue });
    setEditingId(null);
    setEditValue("");
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory({ id: categoryId as any });
      alert("Category deleted!");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-20 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Categories Management
        </h1>
        <p className="text-gray-600">
          Manage all product categories in your system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-80 mx-auto md:w-[35em] lg:w-[40em] xl:w-[45em]">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Filter className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Categories
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  categories.filter((cat) => {
                    const createdDate = new Date(cat._creationTime);
                    const now = new Date();
                    const daysDiff =
                      (now.getTime() - createdDate.getTime()) /
                      (1000 * 60 * 60 * 24);
                    return daysDiff <= 7;
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Plus className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  categories.filter((cat) => {
                    const createdDate = new Date(cat._creationTime);
                    const now = new Date();
                    return (
                      createdDate.getMonth() === now.getMonth() &&
                      createdDate.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 w-80 mx-auto md:w-[35em] lg:w-[40em] xl:w-[45em]">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="createdAt">Sort by Date</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Add New Button */}
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleAddCategory}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden w-80 mx-auto md:w-[35em] lg:w-[40em] xl:w-[45em]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No categories found</p>
                      <p className="text-sm">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === category._id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        <div className="flex items-center">
                          {category.image && (
                            <img
                              className="h-10 w-10 rounded-full mr-4 object-cover"
                              src={category.image}
                              alt={category.name}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {category.name || "Unnamed Category"}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {category._id}
                            </div>
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(category._creationTime)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {editingId === category._id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(category._id)}
                              className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50"
                              title="Save"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditValue("");
                              }}
                              className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-50"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                handleEdit(category._id, category.name || "")
                              }
                              className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50"
                              title="Edit Category"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
                              title="Delete Category"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
        <div>
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
        <div>
          {searchTerm && `Filtered by: "${searchTerm}"`}
          {/* {filterStatus !== "all" && ` • Status: ${filterStatus}`} */}
        </div>
      </div>
    </div>
  );
};

export default ViewAllCategories;
