from locust import HttpUser, between, task


class EnquiryUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def submit_enquiry(self):
        self.client.post(
            "/api/v1/enquiries",
            data={
                "name": "Load Test User",
                "email": "loadtest@example.com",
                "phone": "+919876543210",
                "company": "Load Test Company",
                "project_type": "Ad Films",
                "budget": "50000",
                "message": (
                    "This is a performance load testing "
                    "enquiry for the application."
                ),
            },
            name="POST /api/v1/enquiries",
        )