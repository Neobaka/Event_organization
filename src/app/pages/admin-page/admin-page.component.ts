import {Component, inject} from '@angular/core';
import {UserDetails} from '../../auth/services/auth2.service';
import {AdminService} from '../../admin/admin.service';
import {HeaderComponent} from '../../common-ui/header/header.component';
import { MatIcon } from '@angular/material/icon';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
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
export class AdminPageComponent {
  page = 0;
  size = 100;
  editUser: UserDetails | null = null;
  showEditModal = false;
  editDisplayName = '';
  editRole = '';
  hasMoreUsers = true;
  allUsers: UserDetails[] = [];
  searchQuery: string = '';
  filteredUsers: UserDetails[] = [];
  isLoading = false;

  private adminService = inject(AdminService);

  ngOnInit() {
    this.loadUsers(true);
  }

  loadUsers(reset: boolean = false) {
    if (reset) {
      this.page = 0;
      this.allUsers = [];
      this.hasMoreUsers = true;
    }
    this.isLoading = true;
    this.adminService.getAllUsers(this.page, this.size).subscribe(users => {
      if (users.length < this.size) {
        this.hasMoreUsers = false;
      }
      this.allUsers = [...this.allUsers, ...users];
      this.isLoading = false;
      this.page++;
      this.applyUserFilter();
    });
  }

  loadMoreUsers() {
    this.loadUsers();
  }

  onSearchChange() {
    this.applyUserFilter();
  }

  applyUserFilter() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredUsers = [...this.allUsers];
    } else {
      this.filteredUsers = this.allUsers.filter(user =>
        (user.displayName && user.displayName.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query))
      );
    }
  }

  openEditUserModal(user: UserDetails) {
    this.editUser = user;
    this.editDisplayName = user.displayName;
    this.editRole = user.role;
    this.showEditModal = true;
  }

  cancelEditUser() {
    this.showEditModal = false;
    this.editUser = null;
  }

  saveEditUser() {
    if (!this.editUser) return;
    const updateData = {
      DisplayName: this.editDisplayName,
      Role: this.editRole,
      FileName: this.editUser.fileName
    };
    this.adminService.updateUser(this.editUser.id, updateData).subscribe(() => {
      this.loadUsers();
      this.cancelEditUser();
    });
  }
}
