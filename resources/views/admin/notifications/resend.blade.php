@extends('admin.master');
@section('content');
<div class="content-wrapper">
 
    <a href="">
        <button type="button" class="btn btn-primary d-inline-block m-2 float-right">Back Notification</button>
</a>  

<h3 style="margin-left: 30%">Resend Notifications</h3>
<table class="table table-striped">
    <thead>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">Message</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
        </tr>
    </thead>
        @foreach($notifications as $notification)
            <tr>
                <td>{{ $notification->_id }}</td>
                <td>{{ $notification->msg }}</td>
                <td>{{ $notification->status == 1 ? 'Active' : 'Inactive' }}</td>
                <td>
                    <a href="{{ url('/resend/'.$notification->id) }}">Resend</a>
                </td>
            </tr>
        @endforeach
    </table>

</div>
@endsection