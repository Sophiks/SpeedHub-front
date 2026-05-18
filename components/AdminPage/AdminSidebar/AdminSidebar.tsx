"use client";

import React from "react";
import css from "./AdminSidebar.module.css";

import { AdminTab } from "../AdminHeader/AdminHeader";

interface AdminSidebarProps {
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
}

export default function AdminSidebar({
                                         activeTab,
                                         setActiveTab,
                                     }: AdminSidebarProps) {
    const menuItems: { id: AdminTab; label: string; icon: string }[] = [
        { id: "users", label: "Користувачі", icon: "👤" },
        { id: "lectures", label: "Лекції", icon: "📚" },
        { id: "tests", label: "Тести", icon: "📝" },
        { id: "reviews", label: "Відгуки", icon: "⭐" },
    ];

    return (
        <aside className={css.sidebar}>
            <h2 className={css.logo}>
                Speed<span className={css.logoAccent}>hub</span> Admin
            </h2>
            <nav className={css.nav}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`${css.navBtn} ${activeTab === item.id ? css.active : ""}`}
                    >
                        <span className={css.icon}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}