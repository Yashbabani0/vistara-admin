"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { menuItems } from "./MenuItems.json";
import {
  ChevronDown,
  ChevronRight,
  MenuIcon,
  XIcon,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Megaphone,
  BarChart2,
  Headphones,
  FileText,
  FolderTree,
  Grid,
} from "lucide-react";

interface SubItem {
  title: string;
  path: string;
}

interface MenuItem {
  title: string;
  icon: string;
  path: string;
  subItems?: SubItem[];
}

export default function PcSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleSubmenu = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isLinkActive = (path: string, isParent: boolean = false) => {
    if (isParent) {
      const pathParts = pathname.split("/").filter(Boolean);
      const itemParts = path.split("/").filter(Boolean);
      return itemParts.every((part, i) => pathParts[i] === part);
    }
    return pathname === path;
  };

  // Function to render the icon based on icon name
  const renderIcon = (iconName: string) => {
    const iconProps = { size: 20 };
    switch (iconName) {
      case "dashboard":
        return <LayoutDashboard {...iconProps} />;
      case "package":
        return <Package {...iconProps} />;
      case "shopping-cart":
        return <ShoppingCart {...iconProps} />;
      case "users":
        return <Users {...iconProps} />;
      case "megaphone":
        return <Megaphone {...iconProps} />;
      case "bar-chart":
        return <BarChart2 {...iconProps} />;
      case "headphones":
        return <Headphones {...iconProps} />;
      case "file-text":
        return <FileText {...iconProps} />;
      case "folder":
        return <FolderTree {...iconProps} />;
      case "grid":
        return <Grid {...iconProps} />;
      default:
        return <span className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`hidden md:flex flex-col h-screen bg-white border-r border-gray-200 ${
        isOpen ? "w-72" : "w-20"
      } transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {isOpen && <h1 className="text-xl font-bold">Vistara Dashboard</h1>}
        <button
          onClick={toggleSidebar}
          className="p-2 mx-2 hover:bg-gray-100 rounded-lg"
        >
          {isOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          {menuItems.map((item: MenuItem) => (
            <div key={item.title} className="mb-1">
              {/* Main Menu Item */}
              {!item.subItems ? (
                <Link href={item.path}>
                  <div
                    className={`flex items-center px-3 py-2 rounded-lg cursor-pointer ${
                      isLinkActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50"
                    } ${isOpen ? "justify-start" : "justify-center"}`}
                  >
                    {renderIcon(item.icon)}
                    {isOpen && <span className="ml-3">{item.title}</span>}
                  </div>
                </Link>
              ) : (
                // Menu Item with Submenu
                <div>
                  <div
                    onClick={() => toggleSubmenu(item.title)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                      isLinkActive(item.path, true)
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-50"
                    } ${isOpen ? "justify-between" : "justify-center"}`}
                  >
                    <div className="flex items-center">
                      {renderIcon(item.icon)}
                      {isOpen && <span className="ml-3">{item.title}</span>}
                    </div>
                    {isOpen &&
                      (expandedItems[item.title] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      ))}
                  </div>

                  {/* Submenu Items */}
                  {isOpen && expandedItems[item.title] && (
                    <div className="ml-4 mt-1">
                      {item.subItems.map((subItem) => (
                        <Link key={subItem.path} href={subItem.path}>
                          <div
                            className={`flex items-center px-3 py-2 rounded-lg cursor-pointer ${
                              isLinkActive(subItem.path)
                                ? "bg-blue-50 text-blue-600"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <span>{subItem.title}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
