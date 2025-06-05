import { Component, inject, ChangeDetectionStrategy, signal, computed, OnInit } from '@angular/core';
import { AdminService } from '../../core/admin/services/admin.service';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDetails } from '../../core/auth/interfaces/user-details';
import {UpdateUserData} from '../../core/admin/interfaces/update-user-data';



@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-admin-page',
    imports: [
        HeaderComponent,
        MatIcon,
        NgClass,
        NgForOf,
        NgIf,
        FormsModule
    ],
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent implements OnInit {
    page = signal(0);
    size = 100;
    allUsers = signal<UserDetails[]>([]);
    isLoading = signal(false);
    hasMoreUsers = signal(true);
    searchQuery = signal('');
    showEditModal = signal(false);
    editUser = signal<UserDetails | null>(null);
    editDisplayName = signal('');
    editRole = signal('');

    private _adminService: AdminService = inject(AdminService);

    filteredUsers = computed(() => {
        const query = this.searchQuery().trim().toLowerCase();
        if (!query) {return this.allUsers();}

        return this.allUsers().filter(user =>
            (user.displayName && user.displayName.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
        );
    });

    ngOnInit(): void {
        this.loadUsers(true);
    }

    /**
   *
   */
    loadUsers(reset = false): void {
        if (reset) {
            this.page.set(0);
            this.allUsers.set([]);
            this.hasMoreUsers.set(true);
        }
        this.isLoading.set(true);
        this._adminService.getAllUsers(this.page(), this.size).subscribe(users => {
            console.log(users);
            if (users.length < this.size) {
                this.hasMoreUsers.set(false);
            }
            this.allUsers.set([...this.allUsers(), ...users]);
            this.isLoading.set(false);
            this.page.set(this.page() + 1);
        });
    }

    /**
     *
     */
    loadMoreUsers(): void {
        this.loadUsers();
    }

    /**
     *
     */
    onSearchChange(query: string): void {
        this.searchQuery.set(query);
    }

    /**
     *
     */
    openEditUserModal(user: UserDetails): void {
        this.editUser.set(user);
        this.editDisplayName.set(user.displayName);
        this.editRole.set(user.role);
        this.showEditModal.set(true);
    }

    /**
     *
     */
    cancelEditUser(): void {
        this.showEditModal.set(false);
        this.editUser.set(null);
    }

    /**
     *
     */
    saveEditUser(): void {
        const user = this.editUser();
        if (!user) {return;}
        const updateData: UpdateUserData = {
            DisplayName: this.editDisplayName(),
            Role: this.editRole(),
            FileName: user.fileName
        };
        this._adminService.updateUser(user.id, updateData).subscribe(() => {
            this.loadUsers();
            this.cancelEditUser();
        });
    }
}
