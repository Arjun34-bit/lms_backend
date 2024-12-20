@extends('admin.master')

@section('content')
<div class="content-wrapper">
    <div class="content-header">
        
        <div class="container-fluid">
            <h1>Pending Course Approvals</h1>
            
            @if($pendingCourses->count() > 0)
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Instructor</th>
                                <th>Category</th>
                                <th>Submitted On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($pendingCourses as $course)
                                <tr>
                                    <td>{{ $course->title }}</td>
                                    <td>{{ $course->instructor->name }}</td>
                                    <td>{{ $course->category }}</td>
                                    <td>{{ $course->created_at->format('M d, Y') }}</td>
                                    <td>
                                        <button class="btn btn-success btn-sm" 
                                                onclick="approveCourse({{ $course->id }})">
                                            Approve
                                        </button>
                                        <button class="btn btn-danger btn-sm" 
                                                onclick="showRejectModal({{ $course->id }})">
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <p>No pending courses for review.</p>
            @endif
        </div>
    </div>
</div>

<!-- Reject Modal -->
<div class="modal fade" id="rejectModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="rejectForm" method="POST">
                @csrf
                <div class="modal-header">
                    <h5 class="modal-title">Reject Course</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Rejection Remarks</label>
                        <textarea name="remarks" class="form-control" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-danger">Reject Course</button>
                </div>
            </form>
        </div>
    </div>
</div>

@push('scripts')
<script>
function approveCourse(courseId) {
    if(confirm('Are you sure you want to approve this course?')) {
        axios.post(`/admin/courses/${courseId}/approve`)
            .then(response => {
                location.reload();
            });
    }
}

function showRejectModal(courseId) {
    const modal = $('#rejectModal');
    modal.find('#rejectForm').attr('action', `/admin/courses/${courseId}/reject`);
    modal.modal('show');
}
</script>
@endpush
@endsection 