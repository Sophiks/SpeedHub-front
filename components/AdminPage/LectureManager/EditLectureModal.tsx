"use client";

import React, { useState, useEffect } from "react";
import { Lecture } from "@/app/services/lectureAdminService";
import styles from "../EditQuestionModal/EditQuestionModal.module.css"; // Перевикористовуємо твої стилі!

interface EditLectureModalProps {
    lecture: Lecture | null;
    onClose: () => void;
    onSave: (lectureData: Partial<Lecture>) => Promise<void>;
}

export default function EditLectureModal({ lecture, onClose, onSave }: EditLectureModalProps) {
    const [topicId, setTopicId] = useState("");
    const [topicPrefix, setTopicPrefix] = useState("");
    const [title, setTitle] = useState("");
    const [contentHtml, setContentHtml] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    useEffect(() => {
        if (lecture) {
            setTopicId(lecture.topic_id || "");
            setTopicPrefix(lecture.topic_prefix || "");
            setTitle(lecture.title || "");
            setContentHtml(lecture.content_html || "");
        } else {
            setTopicId("");
            setTopicPrefix("");
            setTitle("");
            setContentHtml("");
        }
    }, [lecture]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSave({
                topic_id: topicId,
                topic_prefix: topicPrefix,
                title: title,
                content_html: contentHtml,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal} style={{ maxWidth: "700px" }}>
                <button className={styles.closeBtn} onClick={onClose}>
                    &times;
                </button>
                <h2 className={styles.modalTitle}>
                    {lecture?._id ? `Редагування ${lecture.topic_id.toUpperCase()}` : "Нова лекція"}
                </h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label>ID Теми (напр. r1)</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={topicId}
                            onChange={(e) => setTopicId(e.target.value)}
                            placeholder="r1"
                            required
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>Префікс теми (напр. r1_)</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={topicPrefix}
                            onChange={(e) => setTopicPrefix(e.target.value)}
                            placeholder="r1_"
                            required
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>Назва розділу</label>
                        <input
                            className={styles.input}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Розділ 1. Загальні положення"
                            required
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label>Контент лекції (HTML розмітка)</label>
                        <textarea
                            className={styles.textarea}
                            style={{ minHeight: "200px", fontFamily: "monospace" }}
                            value={contentHtml}
                            onChange={(e) => setContentHtml(e.target.value)}
                            placeholder="<div class='lecture-container'><p>Текст лекції...</p></div>"
                            required
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Скасувати
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>
                            Зберегти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
