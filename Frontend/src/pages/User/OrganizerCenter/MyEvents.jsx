import React from "react";
import styles from "./MyEvents.module.css";

const MyEvents = () => {
    return (
        <div className={styles["my-event-container"]}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h2>Organizer Center</h2>
                </div>
                <ul className={styles["sidebar-menu"]}>
                    <li className={`${styles["menu-item"]} ${styles.active}`}>Sự kiện đã tạo</li>
                    <li className={styles["menu-item"]}>Quản lý xuất file</li>
                    <li className={styles["menu-item"]}>Tạo sự kiện</li>
                    <li className={styles["menu-item"]}>Điều khoản cho Ban tổ chức</li>
                </ul>
            </aside>

            <main className={styles.content}>
                <header className={styles.header}>
                    <h1>Sự kiện đã tạo</h1>
                    <div className={styles["account-dropdown"]}>
                        <span>Tài khoản</span>
                    </div>
                </header>

                {/* Search bar và tab menu */}
                <div className={styles["search-and-tabs"]}>
                    <div className={styles["search-bar"]}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sự kiện"
                            className={styles["search-input"]}
                        />
                        <button className={styles["search-button"]}>🔍</button>
                    </div>
                    <nav className={styles["tab-menu"]}>
                        <button className={`${styles.tab} ${styles.active}`}>Tất cả</button>
                        <button className={styles.tab}>Sắp diễn ra</button>
                        <button className={styles.tab}>Đã qua</button>
                        <button className={styles.tab}>Chờ duyệt</button>
                    </nav>
                </div>

                <div className={styles["content-body"]}>
                    <div className={styles["empty-state"]}>
                        <span>Chưa có sự kiện nào</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyEvents;
