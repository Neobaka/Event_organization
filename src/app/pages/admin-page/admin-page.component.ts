import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { HeaderComponent } from '../../common-ui/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {UserDetails} from '../../auth/models/user-details';

interface UpdateUserData {
  DisplayName: string;
  Role: string;
  FileName: string;
}

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
    public page = 0;
    public size = 100;
    public editUser: UserDetails | null = null;
    public showEditModal = false;
    public editDisplayName = '';
    public editRole = '';
    public hasMoreUsers = true;
    public allUsers: UserDetails[] = [];
    public searchQuery = '';
    public filteredUsers: UserDetails[] = [];
    public isLoading = false;

    private _adminService: AdminService = inject(AdminService);

    public ngOnInit(): void {
        this.loadUsers(true);
    }

    /**
   *
   */
    public loadUsers(reset = false): void {
        if (reset) {
            this.page = 0;
            this.allUsers = [];
            this.hasMoreUsers = true;
        }
        this.isLoading = true;
        this._adminService.getAllUsers(this.page, this.size).subscribe((users: UserDetails[]) => {
            if (users.length < this.size) {
                this.hasMoreUsers = false;
            }
            this.allUsers = [...this.allUsers, ...users];
            this.isLoading = false;
            this.page++;
            this.applyUserFilter();
        });
    }

    /**
   *
   */
    public loadMoreUsers(): void {
        this.loadUsers();
    }

    /**
   *
   */
    public onSearchChange(): void {
        this.applyUserFilter();
    }

    /**
   *
   */
    public applyUserFilter(): void {
        const query: string = this.searchQuery.trim().toLowerCase();
        if (!query) {
            this.filteredUsers = [...this.allUsers];
        } else {
            this.filteredUsers = this.allUsers.filter((user: UserDetails) =>
                (user.displayName && user.displayName.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query))
            );
        }
    }

    /**
   *
   */
    public openEditUserModal(user: UserDetails): void {
        this.editUser = user;
        this.editDisplayName = user.displayName;
        this.editRole = user.role;
        this.showEditModal = true;
    }

    /**
   *
   */
    public cancelEditUser(): void {
        this.showEditModal = false;
        this.editUser = null;
    }

    /**
   *
   */
    public saveEditUser(): void {
        if (!this.editUser) {
            return;
        }
        const updateData: UpdateUserData = {
            DisplayName: this.editDisplayName,
            Role: this.editRole,
            FileName: this.editUser.fileName
        };
        this._adminService.updateUser(this.editUser.id, updateData).subscribe(() => {
            this.loadUsers();
            this.cancelEditUser();
        });
    }
}
