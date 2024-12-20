<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>
        @if(Auth::user()->role == 'admin')
            Admin Dashboard
        @elseif(Auth::user()->role == 'teacher')
            Teacher Dashboard
        @elseif(Auth::user()->role == 'student')
            Student Dashboard
        @else
            User Dashboard
        @endif
    </title>

    <!-- Critical CSS inline -->
    <style>
        .wrapper { min-height: 100%; }
        .sidebar-mini { height: 100%; }
    </style>

    <!-- Preload critical assets -->
    <link rel="preload" href="{{ asset('dist/css/adminlte.min.css') }}" as="style">
    <link rel="preload" href="{{ asset('plugins/fontawesome-free/css/all.min.css') }}" as="style">
    
    <!-- Critical CSS -->
    <link rel="stylesheet" href="{{ asset('dist/css/adminlte.min.css') }}">
    <link rel="stylesheet" href="{{ asset('plugins/fontawesome-free/css/all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/custom.css') }}">

    <!-- Defer non-critical CSS -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="{{ asset('plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css') }}" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="{{ asset('plugins/icheck-bootstrap/icheck-bootstrap.min.css') }}" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="{{ asset('plugins/overlayScrollbars/css/OverlayScrollbars.min.css') }}" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="{{ asset('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') }}" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="{{ asset('plugins/select2/css/select2.min.css') }}" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="{{ asset('plugins/sweetalert2/sweetalert2.min.css') }}" media="print" onload="this.media='all'">
    
    <!-- Preload critical JavaScript -->
    <link rel="preload" href="{{ asset('plugins/jquery/jquery.min.js') }}" as="script">
    <link rel="preload" href="{{ asset('plugins/bootstrap/js/bootstrap.bundle.min.js') }}" as="script">

    <!-- Critical JavaScript -->
    <script src="{{ asset('plugins/jquery/jquery.min.js') }}"></script>
    <script src="{{ asset('plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>

    <!-- Defer non-critical JavaScript -->
    <script defer src="{{ asset('plugins/jquery-ui/jquery-ui.min.js') }}"></script>
    <script defer src="{{ asset('plugins/chart.js/Chart.min.js') }}"></script>
    <script defer src="{{ asset('plugins/sparklines/sparkline.js') }}"></script>
    <script defer src="{{ asset('plugins/jquery-knob/jquery.knob.min.js') }}"></script>
    <script defer src="{{ asset('plugins/moment/moment.min.js') }}"></script>
    <script defer src="{{ asset('plugins/daterangepicker/daterangepicker.js') }}"></script>
    <script defer src="{{ asset('plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js') }}"></script>
    <script defer src="{{ asset('plugins/summernote/summernote-bs4.min.js') }}"></script>
    <script defer src="{{ asset('plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js') }}"></script>
    <script defer src="{{ asset('plugins/datatables/jquery.dataTables.min.js') }}"></script>
    <script defer src="{{ asset('plugins/datatables-bs4/js/dataTables.bootstrap4.min.js') }}"></script>
    <script defer src="{{ asset('plugins/select2/js/select2.full.min.js') }}"></script>
    <script defer src="{{ asset('plugins/sweetalert2/sweetalert2.min.js') }}"></script>
    <script defer src="{{ asset('dist/js/adminlte.js') }}"></script>
    <script defer src="{{ asset('js/custom.js') }}"></script>
</head>
<body class="hold-transition sidebar-mini layout-fixed">

<div class="wrapper">

  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <a href="{{ route('dashboard') }}" class="nav-link"><i class="fas fa-home"></i> Home</a>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <a href="#" class="nav-link"><i class="fas fa-address-book"></i> Contact</a>
      </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a class="nav-link" data-widget="navbar-search" href="#" role="button">
          <i class="fas fa-search"></i>
        </a>
        <div class="navbar-search-block">
          <form class="form-inline">
            <div class="input-group input-group-sm">
              <input class="form-control form-control-navbar" type="search" placeholder="" aria-label="Search">
              <div class="input-group-append">
                <button class="btn btn-navbar" type="submit">
                  <i class="fas fa-search"></i>
                </button>
                <button class="btn btn-navbar" type="button" data-widget="navbar-search">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </li>

      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
          <i class="far fa-comments"></i>
          <span class="badge badge-danger navbar-badge">3</span>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <a href="#" class="dropdown-item">
            <div class="media">
              <img src="{{ asset('dist/img/user1-128x128.jpg') }}" alt="User Avatar" class="img-size-50 mr-3 img-circle">
              <div class="media-body">
                <h3 class="dropdown-item-title">
                  Brad Diesel
                  <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
                </h3>
                <p class="text-sm">Call me whenever you can...</p>
                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <div class="media">
              <img src="{{ asset('dist/img/user8-128x128.jpg') }}" alt="User Avatar" class="img-size-50 img-circle mr-3">
              <div class="media-body">
                <h3 class="dropdown-item-title">
                  John Pierce
                  <span class="float-right text-sm text-muted"><i class="fas fa-star"></i></span>
                </h3>
                <p class="text-sm">I got your message bro</p>
                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item">
            <div class="media">
              <img src="{{ asset('dist/img/user3-128x128.jpg') }}" alt="User Avatar" class="img-size-50 img-circle mr-3">
              <div class="media-body">
                <h3 class="dropdown-item-title">
                  Nora Silvester
                  <span class="float-right text-sm text-warning"><i class="fas fa-star"></i></span>
                </h3>
                <p class="text-sm">The subject goes here</p>
                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
              </div>
            </div>
          </a>
          <div class="dropdown-divider"></div>
          <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>
        </div>
      </li>

      <li class="nav-item dropdown">
        <a class="nav-link notification-bell" data-toggle="dropdown" href="#">
            <i class="far fa-bell"></i>
            <span class="badge badge-warning navbar-badge">0</span>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right notification-dropdown">
            <span class="dropdown-item dropdown-header">Notifications</span>
            <div class="dropdown-divider"></div>
            <div class="dropdown-divider"></div>
            <a href="{{ route('notifications.index') }}" class="dropdown-item dropdown-footer">
                See All Notifications
            </a>
            <a href="#" class="dropdown-item dropdown-footer" id="mark-all-read">
                Mark All as Read
            </a>
        </div>
      </li>

      <li class="nav-item">
        <a class="nav-link" data-widget="fullscreen" href="#" role="button">
          <i class="fas fa-expand-arrows-alt"></i>
        </a>
      </li>

      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
          <i class="far fa-user"></i>
          <span>{{ Auth::user()->name }}</span>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <span class="dropdown-item dropdown-header">User Profile</span>
          <div class="dropdown-divider"></div>
          <a href="{{ route('profile.show') }}" class="dropdown-item">
            <i class="fas fa-user mr-2"></i> My Profile
          </a>
          <div class="dropdown-divider"></div>
          <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="dropdown-item">
              <i class="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
          </form>
        </div>
      </li>
    </ul>
  </nav>
  <!-- /.navbar -->

  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="{{ route('dashboard') }}" class="brand-link">
      <img src="{{ asset('dist/img/AdminLTELogo.png') }}" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
      <span class="brand-text font-weight-light">Pcc Admin Panel</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <h5 style="color: white">
            @if(Auth::user()->role == 'admin')
              <i class="fas fa-user-shield"></i> Admin Dashboard
            @elseif(Auth::user()->role == 'teacher')
              <i class="fas fa-chalkboard-teacher"></i> Teacher Dashboard
            @elseif(Auth::user()->role == 'student') 
              <i class="fas fa-user-graduate"></i> Student Dashboard
            @else
              <i class="fas fa-user"></i> User Dashboard  
            @endif
          </h5>
        </div>
      </div>

      <!-- SidebarSearch Form -->
      <div class="form-inline">
        <div class="input-group" data-widget="sidebar-search">
          <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search">
          <div class="input-group-append">
            <button class="btn btn-sidebar">
              <i class="fas fa-search fa-fw"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Dashboard -->
          <li class="nav-item">
            <a href="{{ route('dashboard') }}" class="nav-link {{ request()->is('dashboard') ? 'active' : '' }}">
              <i class="nav-icon fas fa-tachometer-alt"></i>
              <p>
                Dashboard
              </p>
            </a>
          </li>

          <!-- Notifications -->
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="nav-icon fas fa-bell"></i>
              <p>
                Notifications
                <span class="badge badge-warning right">New</span>
              </p>
            </a>
          </li>

          <!-- Courses -->
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="nav-icon fas fa-book"></i>
              <p>
                Courses
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="{{ route('courses.index') }}" class="nav-link {{ request()->is('admin/courses') ? 'active' : '' }}">
                  <i class="far fa-circle nav-icon"></i>
                  <p>All Courses</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="{{ route('courses.create') }}" class="nav-link {{ request()->is('admin/courses/create') ? 'active' : '' }}">
                  <i class="far fa-circle nav-icon"></i>
                  <p>Add New Course</p>
                </a>
              </li>
            </ul>
          </li>

          <!-- Live Sessions -->
          <li class="nav-item">
            <a href="{{ route('admin.live-classes.index') }}" class="nav-link {{ request()->routeIs('admin.live-classes.*') ? 'active' : '' }}">
                <i class="nav-icon fas fa-video"></i>
                <p>
                    Live Classes
                    @php
                        $upcomingClassesCount = \App\Models\LiveClass::where('status', 'scheduled')
                            ->where('start_time', '>', \Carbon\Carbon::now())
                            ->count();
                    @endphp
                    <span class="badge badge-warning right">{{ $upcomingClassesCount }}</span>
                </p>
            </a>
          </li>

          <!-- Additional Routes -->
          <li class="nav-item">
            <a href="{{ route('listnotification') }}" class="nav-link">
              <i class="nav-icon fas fa-keyboard"></i>
              <p>
                Notification
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="{{ route('listvideo') }}" class="nav-link">
              <i class="nav-icon fas fa-table"></i>
              <p>
                Video
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="{{ route('listm') }}" class="nav-link">
              <i class="nav-icon fas fa-table"></i>
              <p>
                Meeting
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="{{ route('listtech') }}" class="nav-link">
              <i class="nav-icon fas fa-th"></i>
              <p>
                Teacher Management
                <span class="right badge badge-danger">New</span>
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="{{ route('liststud') }}" class="nav-link">
              <i class="nav-icon fas fa-copy"></i>
              <p>
                Student Management
                <i class="fas fa-angle-left right"></i>
                <span class="badge badge-info right">6</span>
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="{{ route('listcourse') }}" class="nav-link">
              <i class="nav-icon fas fa-edit"></i>
              <p>
                Course Management
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="{{ route('listscholarship') }}" class="nav-link">
              <i class="nav-icon fas fa-th"></i>
              <p>
                Scholarship News
                <span class="right badge badge-danger">New</span>
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="{{ route('listclassol') }}" class="nav-link">
              <i class="nav-icon fas fa-th"></i>
              <p>
                Live Class
                <span class="right badge badge-danger">New</span>
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="{{ route('listass') }}" class="nav-link">
              <i class="nav-icon fas fa-table"></i>
              <p>
                Assignment
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="{{ route('listtest') }}" class="nav-link">
              <i class="nav-icon fas fa-table"></i>
              <p>
                Test
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="{{ route('listnotes') }}" class="nav-link">
              <i class="nav-icon fas fa-table"></i>
              <p>
                Library (Notes)
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="{{ route('listpcc') }}" class="nav-link">
              <i class="nav-icon fas fa-table"></i>
              <p>
                PCC Center
                <i class="fas fa-angle-left right"></i>
              </p>
            </a>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>

  <div id="loader">
    <div class="spinner"></div>
  </div>

  @yield('content')

  <!-- Initialize components after load -->
  <script>
      document.addEventListener('DOMContentLoaded', function() {
          $.widget.bridge('uibutton', $.ui.button);
          $('.datatable').DataTable();
          $('.select2').select2();
          initializeCustomFunctions();
      });

      function initializeCustomFunctions() {
          console.log('Custom functions initialized');
      }
  </script>

  @php
      header('Cache-Control: public, max-age=3600');
  @endphp

</body>
</html>
