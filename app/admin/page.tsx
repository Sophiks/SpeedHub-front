"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminPage/AdminSidebar/AdminSidebar";
import AdminHeader, { AdminTab } from "@/components/AdminPage/AdminHeader/AdminHeader";
import UserTable from "@/components/AdminPage/UserTable/UserTable";
import TestManager from "@/components/AdminPage/TestManager/TestManager";
import ReviewManager from "@/components/AdminPage/ReviewManager/ReviewManager";
import LectureManager from "@/components/AdminPage/LectureManager/LectureManager";

import { adminService } from "@/app/services/adminService";
import { reviewAdminService, Review } from "@/app/services/reviewAdminService";
import { lectureAdminService, Lecture } from "@/app/services/lectureAdminService";
import { User } from "@/types/user";
import styles from "./AdminPage.module.css";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);

  const [totalTests, setTotalTests] = useState(40);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    if (role === "admin" && token && token !== "undefined") {
      setIsAuthorized(true);
    } else {
      router.push("/");
    }
  }, [router]);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reviewAdminService.getAllReviews();
      setReviews(data || []);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLectures = useCallback(async () => {
    try {
      setLoading(true);
      const data = await lectureAdminService.getAllLectures();
      setLectures(data || []);
    } catch (err) {
      console.error("Fetch lectures error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;

    if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "reviews") {
      loadReviews();
    } else if (activeTab === "lectures") {
      loadLectures();
    }
  }, [isAuthorized, activeTab, loadUsers, loadReviews, loadLectures]);

  useEffect(() => {
    if (isAuthorized) {
      reviewAdminService.getAllReviews()
          .then(data => setReviews(data || []))
          .catch(err => console.error("Initial reviews fetch error:", err));

      lectureAdminService.getAllLectures()
          .then(data => setLectures(data || []))
          .catch(err => console.error("Initial lectures fetch error:", err));
    }
  }, [isAuthorized]);

  if (!isAuthorized) return null;

  const adminStats = {
    totalUsers: users.length,
    premiumUsers: users.filter((u) => u.subscriptionType === "premium").length,
    totalLectures: lectures.length, // Отримує реальні 42 лекції з вашої бд
    totalTests: totalTests,
    pendingReviews: reviews.filter((r) => !r.isApproved).length,
    approvedReviews: reviews.filter((r) => r.isApproved).length,
  };

  return (
      <div className={styles.adminContainer}>
        {/* Панель навігації */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className={styles.mainContent}>
          {/* Динамічний Хедер */}
          <AdminHeader currentTab={activeTab} stats={adminStats} />

          {/* Контент-менеджери вкладок */}
          {activeTab === "users" && (
              <UserTable
                  users={users}
                  loading={loading}
                  refreshData={loadUsers}
              />
          )}

          {activeTab === "tests" && <TestManager />}

          {activeTab === "reviews" && <ReviewManager />}

          {activeTab === "lectures" && <LectureManager />}
        </main>
      </div>
  );
}