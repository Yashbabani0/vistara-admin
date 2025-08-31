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

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

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
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-transparent px-4 py-3 w-20">
        <button
          onClick={toggleMenu}
          className="p-2 cursor-pointer rounded-lg"
          aria-label="Toggle Menu"
        >
          <MenuIcon size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Vistara Dashboard</h1>
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Menu Content */}
        <div className="overflow-y-auto h-[calc(100vh-64px)] pb-20">
          <nav className="p-2">
            {menuItems.map((item: MenuItem) => (
              <div key={item.title} className="mb-1">
                {/* Main Menu Item */}
                {!item.subItems ? (
                  <Link href={item.path} onClick={toggleMenu}>
                    <div
                      className={`flex items-center px-3 py-3 rounded-lg cursor-pointer ${
                        isLinkActive(item.path)
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {renderIcon(item.icon)}
                      <span className="ml-3">{item.title}</span>
                    </div>
                  </Link>
                ) : (
                  // Menu Item with Submenu
                  <div>
                    <div
                      onClick={() => toggleSubmenu(item.title)}
                      className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer ${
                        isLinkActive(item.path, true)
                          ? "bg-blue-50 text-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        {renderIcon(item.icon)}
                        <span className="ml-3">{item.title}</span>
                      </div>
                      {expandedItems[item.title] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>

                    {/* Submenu Items */}
                    {expandedItems[item.title] && (
                      <div className="ml-4 mt-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            onClick={toggleMenu}
                          >
                            <div
                              className={`flex items-center px-3 py-3 rounded-lg cursor-pointer ${
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
    </>
  );
}
