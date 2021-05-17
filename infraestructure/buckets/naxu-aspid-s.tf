resource "aws_s3_bucket" "naxu-aspid-s" {
  bucket = "naxu-aspid-s"
  acl    = "public-read"
  versioning {
    enabled = true
  }
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET", "HEAD", "DELETE"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 3000
  }


  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AddPerm",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::naxu-aspid-s/*"
    }
  ]
}
POLICY

}

resource "aws_cloudfront_distribution" "naxu-aspid-s_distribution" {
  origin {
    domain_name = aws_s3_bucket.naxu-aspid-s.bucket_regional_domain_name
    origin_id   = "s3-naxu-aspid-s"
  }
  enabled             = true
  default_root_object = "index.html"
  is_ipv6_enabled     = true
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    target_origin_id       = "s3-naxu-aspid-s"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
